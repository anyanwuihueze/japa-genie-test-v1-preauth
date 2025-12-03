import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_header.dart';
import 'app_footer.dart';
import 'floating_chat_button.dart';

class MainLayout extends StatelessWidget {
  final Widget child;
  const MainLayout({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0f172a),
      floatingActionButton: const FloatingChatButton(),
      body: SafeArea(
        child: Column(
          children: [AppHeader(), Expanded(child: child), AppFooter()],
        ),
      ),
    );
  }
}

class ChatLayout extends StatelessWidget {
  final Widget child;
  const ChatLayout({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('Japa Genie Chat', style: GoogleFonts.inter()),
        backgroundColor: Colors.white,
        elevation: 1,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: child,
    );
  }
}

class LayoutSwitcher extends StatelessWidget {
  final Widget child;
  const LayoutSwitcher({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final route = ModalRoute.of(context)?.settings.name ?? '';
    return route.startsWith('/chat') ? ChatLayout(child: child) : MainLayout(child: child);
  }
}