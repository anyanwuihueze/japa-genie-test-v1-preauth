import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppFooter extends StatelessWidget {
  const AppFooter({super.key});

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;
    return Container(
      width: double.infinity,
      color: const Color(0xFF0f172a),
      padding: EdgeInsets.symmetric(vertical: 24, horizontal: isMobile ? 16 : 24),
      child: Column(
        children: [
          Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            const FlutterLogo(size: 20),
            const SizedBox(width: 6),
            Text('Japa Genie', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: Colors.white)),
          ]),
          const SizedBox(height: 6),
          Text('© ${DateTime.now().year} All rights reserved.',
              style: GoogleFonts.inter(fontSize: 12, color: Colors.white70)),
          const SizedBox(height: 6),
          Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            _footerLink(context, 'Privacy'), const SizedBox(width: 12),
            _footerLink(context, 'Terms'),  const SizedBox(width: 12),
            _footerLink(context, 'Contact'),
          ]),
        ],
      ),
    );
  }

  Widget _footerLink(BuildContext context, String t) => TextButton(
      onPressed: () => Navigator.pushNamed(context, '/${t.toLowerCase()}'),
      child: Text(t, style: GoogleFonts.inter(fontSize: 12, color: Colors.white70)));
}
