import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppHeader extends StatelessWidget {
  AppHeader({super.key});

  final List<Map<String,String>> _navLinks = [
    {'route': '/where-youre-stuck', 'label': "Where You're Stuck"},
    {'route': '/how-it-helps',       'label': 'How It Helps'},
    {'route': '/experts',            'label': 'Expert Help'},
    {'route': '/pricing',            'label': 'Japa Pricing'},
    {'route': '/blog',               'label': 'Japa news'},
    {'route': '/about-us',           'label': 'About Us'},
  ];

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 768;
    return Container(
      height: 64,
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: Colors.white24)),
        color: Color(0xFF0f172a),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.pushNamed(context, '/'),
            child: Row(
              children: [
                const FlutterLogo(size: 32),
                const SizedBox(width: 8),
                Text('Japa Genie',
                    style: GoogleFonts.inter(
                        fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
              ],
            ),
          ),
          const Spacer(),
          if (!isMobile) ..._navLinks.map((l) => _link(context, l['route']!, l['label']!)),
          if (!isMobile) const SizedBox(width: 12),
          _authButtons(context),
          if (isMobile)
            Builder(
              builder: (ctx) => IconButton(
                icon: const Icon(Icons.menu, color: Colors.white),
                onPressed: () => Scaffold.of(ctx).openEndDrawer(),
              ),
            ),
        ],
      ),
    );
  }

  Widget _link(BuildContext ctx, String route, String label) =>
      TextButton(
        onPressed: () => Navigator.pushNamed(ctx, route),
        child: Text(label, style: GoogleFonts.inter(color: Colors.white70, fontSize: 14)),
      );

  Widget _authButtons(BuildContext context) {
    return Row(
      children: [
        TextButton(
          onPressed: () => Navigator.pushNamed(context, '/login'),
          child: Text('Log In', style: GoogleFonts.inter(color: Colors.white)),
        ),
        const SizedBox(width: 8),
        ElevatedButton(
          onPressed: () => Navigator.pushNamed(context, '/kyc'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.blue, padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          ),
          child: Text('Get Started', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}