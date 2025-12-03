import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ChatPanel extends StatefulWidget {
  const ChatPanel({super.key});

  @override
  State<ChatPanel> createState() => _ChatPanelState();
}

class _ChatPanelState extends State<ChatPanel> {
  final List<_Message> _messages = [
    _Message('Hi! I\'m the Japa Genie site assistant. What would you like to know?', false)
  ];
  final TextEditingController _ctrl = TextEditingController();
  bool _loading = false;

  void _send() async {
    if (_ctrl.text.trim().isEmpty || _loading) return;
    setState(() {
      _messages.add(_Message(_ctrl.text, true));
      _loading = true;
    });
    _ctrl.clear();
    await Future.delayed(const Duration(seconds: 1));
    setState(() {
      _messages.add(_Message('I heard you! (connect real /api/visitor-chat later)', false));
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Expanded(
        child: ListView.builder(
          padding: const EdgeInsets.all(12),
          itemCount: _messages.length + (_loading ? 1 : 0),
          itemBuilder: (_, i) {
            if (_loading && i == _messages.length) return _typingBubble();
            final m = _messages[i];
            return Align(
              alignment: m.isUser ? Alignment.centerRight : Alignment.centerLeft,
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * .7),
                decoration: BoxDecoration(
                  color: m.isUser ? Colors.blue : Colors.white12,
                  borderRadius: BorderRadius.only(
                    topLeft: const Radius.circular(16),
                    topRight: const Radius.circular(16),
                    bottomLeft: Radius.circular(m.isUser ? 16 : 4),
                    bottomRight: Radius.circular(m.isUser ? 4 : 16),
                  ),
                ),
                child: Text(m.text, style: GoogleFonts.inter(color: m.isUser ? Colors.white : Colors.white70)),
              ),
            );
          },
        ),
      ),
      Padding(
        padding: const EdgeInsets.all(12),
        child: Row(children: [
          Expanded(
            child: TextField(
              controller: _ctrl,
              decoration: InputDecoration(
                hintText: 'Ask a question...',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              ),
              onSubmitted: (_) => _send(),
            ),
          ),
          const SizedBox(width: 8),
          IconButton(onPressed: _send, icon: const Icon(Icons.send, color: Colors.blue)),
        ]),
      ),
    ]);
  }

  Widget _typingBubble() => Row(children: [
    Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(color: Colors.white12, borderRadius: BorderRadius.circular(12)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        _dot(), const SizedBox(width: 4), _dot(), const SizedBox(width: 4), _dot(),
      ]),
    ),
  ]);

  Widget _dot() => Container(width: 6, height: 6, decoration: const BoxDecoration(color: Colors.white70, shape: BoxShape.circle));
}

class _Message {
  final String text;
  final bool isUser;
  _Message(this.text, this.isUser);
}
