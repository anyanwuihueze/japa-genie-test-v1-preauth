import 'package:flutter/material.dart';
import 'chat_panel.dart';

class FloatingChatButton extends StatelessWidget {
  const FloatingChatButton({super.key});

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      backgroundColor: Colors.blue,
      onPressed: () => Navigator.of(context).push(
        PageRouteBuilder(
          pageBuilder: (_, _, _) => Scaffold(
            backgroundColor: Colors.transparent,
            body: Container(
              height: MediaQuery.of(context).size.height,
              color: const Color(0xFF0f172a),
              child: const SafeArea(child: ChatPanel()),
            ),
          ),
          barrierColor: Colors.black54,
          transitionDuration: const Duration(milliseconds: 200),
          opaque: false,
        ),
      ),
      child: const Icon(Icons.chat_bubble, color: Colors.white),
    );
  }
}