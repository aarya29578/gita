import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/shlok.dart';

class ShlokService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  List<Shlok>? _cacheEnglish;
  List<Shlok>? _cacheHindi;
  List<Shlok>? _firestoreCache;
  String _currentLanguage = 'en';
  DateTime? _lastFetchTime;

  // Cache duration: 5 minutes
  static const _cacheDuration = Duration(minutes: 5);

  /// Get all shloks with language preference
  /// Tries Firestore first, falls back to JSON assets
  Future<List<Shlok>> getAllShloks({
    String language = 'en',
    bool forceRefresh = false,
  }) async {
    _currentLanguage = language;

    // Try to fetch from Firestore first (real-time data)
    try {
      final firestoreShloks =
          await _getFromFirestore(forceRefresh: forceRefresh);
      if (firestoreShloks.isNotEmpty) {
        return firestoreShloks;
      }
    } catch (e) {
      print('Firestore fetch failed, falling back to JSON assets: $e');
    }

    // Fallback to JSON assets (offline support)
    return _getFromAssets(language: language);
  }

  /// Fetch shloks from Firestore (real-time data from Admin panel)
  Future<List<Shlok>> _getFromFirestore({bool forceRefresh = false}) async {
    // Use cache if available and not expired
    if (!forceRefresh &&
        _firestoreCache != null &&
        _lastFetchTime != null &&
        DateTime.now().difference(_lastFetchTime!) < _cacheDuration) {
      return _firestoreCache!;
    }

    final snapshot = await _firestore
        .collection('shloks')
        .orderBy('chapter')
        .orderBy('number')
        .get();

    if (snapshot.docs.isEmpty) {
      return [];
    }

    _firestoreCache = snapshot.docs
        .map((doc) => Shlok.fromFirestore(doc))
        .where((s) => s.title.isNotEmpty)
        .toList();

    _lastFetchTime = DateTime.now();
    return _firestoreCache!;
  }

  /// Get shloks from JSON assets (fallback/offline support)
  Future<List<Shlok>> _getFromAssets({String language = 'en'}) async {
    if (language == 'hi') {
      if (_cacheHindi != null) return _cacheHindi!;

      final raw =
          await rootBundle.loadString('assets/json/shlok_data_hindi.json');
      final List<dynamic> jsonList = jsonDecode(raw);

      _cacheHindi = jsonList
          .skip(1)
          .where((item) => item['__1'] != null && item['__1'] != '')
          .map<Shlok>((e) => Shlok.fromJson(e))
          .where((s) => s.title.isNotEmpty)
          .toList();

      return _cacheHindi!;
    } else {
      // Default to English
      if (_cacheEnglish != null) return _cacheEnglish!;

      final raw = await rootBundle.loadString('assets/json/shlok_data.json');
      final List<dynamic> jsonList = jsonDecode(raw);

      _cacheEnglish = jsonList
          .skip(1)
          .where((item) => item['__1'] != null && item['__1'] != '')
          .map<Shlok>((e) => Shlok.fromJson(e))
          .where((s) => s.title.isNotEmpty)
          .toList();

      return _cacheEnglish!;
    }
  }

  Future<Shlok?> getShlokById(String id, {String language = 'en'}) async {
    final all = await getAllShloks(language: language);
    try {
      return all.firstWhere((s) => s.id == id);
    } catch (e) {
      return null;
    }
  }

  /// Unicode-safe string normalization for search
  String _normalizeForSearch(String text, String language) {
    // Trim whitespace
    text = text.trim();

    // For English, use case-insensitive comparison
    if (language == 'en') {
      return text.toLowerCase();
    }

    // For Hindi and other languages, preserve Unicode exactly
    // No toLowerCase() as it doesn't work correctly with Devanagari
    return text;
  }

  /// Check if text contains query (Unicode-safe)
  bool _containsQuery(String text, String query, String language) {
    final normalizedText = _normalizeForSearch(text, language);
    final normalizedQuery = _normalizeForSearch(query, language);
    return normalizedText.contains(normalizedQuery);
  }

  Future<List<Shlok>> searchShloks(String query,
      {String language = 'en'}) async {
    final all = await getAllShloks(language: language);

    // Trim the query
    final q = query.trim();
    if (q.isEmpty) return all;

    return all.where((s) {
      if (language == 'hi') {
        // Search Hindi fields first, fallback to English
        final titleMatch = _containsQuery(s.titleHi ?? s.title, q, language);
        final summaryMatch =
            _containsQuery(s.summaryHi ?? s.summary, q, language);

        // Check Hindi keywords if available
        final keywordsMatch = (s.keywordsHi ?? s.keywords)
            .any((k) => _containsQuery(k, q, language));

        // Also check speaker and theme Hindi fields
        final speakerMatch = s.speakerHi != null
            ? _containsQuery(s.speakerHi!, q, language)
            : false;
        final themeMatch =
            s.themeHi != null ? _containsQuery(s.themeHi!, q, language) : false;

        return titleMatch ||
            summaryMatch ||
            keywordsMatch ||
            speakerMatch ||
            themeMatch;
      } else {
        // English search
        return _containsQuery(s.title, q, language) ||
            _containsQuery(s.summary, q, language) ||
            s.keywords.any((k) => _containsQuery(k, q, language));
      }
    }).toList();
  }

  Future<List<Shlok>> getFilteredShloks(Map<String, dynamic> filters,
      {String language = 'en'}) async {
    final all = await getAllShloks(language: language);
    return all.where((shlok) {
      for (var entry in filters.entries) {
        if (entry.value == null) continue;
        switch (entry.key) {
          case 'chapter':
            if (shlok.chapter != entry.value) return false;
            break;
          case 'speaker':
            if (shlok.speaker != entry.value) return false;
            break;
          case 'theme':
            if (shlok.theme != entry.value) return false;
            break;
          case 'star':
            if (shlok.star != entry.value) return false;
            break;
        }
      }
      return true;
    }).toList();
  }

  /// Force refresh shloks from Firestore
  /// Call this manually to get latest data immediately
  Future<List<Shlok>> refreshShloks({String language = 'en'}) async {
    _firestoreCache = null;
    _lastFetchTime = null;
    return getAllShloks(language: language, forceRefresh: true);
  }

  /// Clear all caches
  void clearCache() {
    _cacheEnglish = null;
    _cacheHindi = null;
    _firestoreCache = null;
    _lastFetchTime = null;
  }

  /// Stream shloks in real-time from Firestore
  Stream<List<Shlok>> streamShloks() {
    return _firestore
        .collection('shloks')
        .orderBy('chapter')
        .orderBy('number')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => Shlok.fromFirestore(doc))
          .where((s) => s.title.isNotEmpty)
          .toList();
    });
  }
}
