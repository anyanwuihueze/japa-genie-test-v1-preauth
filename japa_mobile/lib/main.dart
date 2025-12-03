import 'package:flutter/material.dart';
import 'pages/landing_page.dart';
import 'pages/chat_dummy.dart';
import 'widgets/layout_switcher.dart';

void main() {
  runApp(const JapaGenieApp());
}

class JapaGenieApp extends StatelessWidget {
  const JapaGenieApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Japa Genie',
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (_) => LayoutSwitcher(child: LandingPage()),
        '/chat': (_) => LayoutSwitcher(child: ChatDummy()),
      },
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0f172a),
      ),
    );
  }
}