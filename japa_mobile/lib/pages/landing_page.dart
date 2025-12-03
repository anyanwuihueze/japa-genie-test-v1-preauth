import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:japa_mobile/widgets/app_footer.dart';
import 'package:japa_mobile/widgets/floating_chat_button.dart';

class LandingPage extends StatelessWidget {
  LandingPage({super.key});

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
    return Scaffold(
      backgroundColor: const Color(0xFF0f172a),
      endDrawer: isMobile ? _drawer(context) : null,
      floatingActionButton: const FloatingChatButton(),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: isMobile ? 20 : 40, vertical: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // HERO SECTION
              RichText(
                text: TextSpan(
                  style: GoogleFonts.inter(fontSize: isMobile ? 28 : 38, fontWeight: FontWeight.w900, height: 1.2),
                  children: const [
                    TextSpan(text: 'STOP Getting ', style: TextStyle(color: Colors.white)),
                    TextSpan(text: 'Scammed', style: TextStyle(color: Color(0xFFef4444))),
                    TextSpan(text: ' by ', style: TextStyle(color: Colors.white)),
                    TextSpan(text: 'Fake', style: TextStyle(color: Color(0xFFef4444))),
                    TextSpan(text: ' Visa Agents.\n'),
                    TextSpan(text: 'START Getting ', style: TextStyle(color: Colors.white)),
                    TextSpan(text: 'Real Results.', style: TextStyle(color: Color(0xFFfacc15))),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Japa Genie is your AI-powered guide for navigating the complex world of visas.',
                style: GoogleFonts.inter(fontSize: isMobile ? 14 : 16, color: const Color(0xFFcbd5e1), height: 1.5),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(999),
                        gradient: const LinearGradient(colors: [Color(0xFFf59e0b), Color(0xFF2563eb)]),
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(999),
                          onTap: () => Navigator.pushNamed(context, '/kyc'),
                          child: Padding(
                            padding: EdgeInsets.symmetric(vertical: isMobile ? 14 : 16),
                            child: Center(
                              child: Text('Start Your Journey', style: GoogleFonts.inter(fontSize: isMobile ? 15 : 17, fontWeight: FontWeight.bold, color: Colors.white)),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pushNamed(context, '/how-it-works'),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFF94a3b8)),
                        padding: EdgeInsets.symmetric(vertical: isMobile ? 14 : 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                      ),
                      child: Text('Learn How It Works', style: GoogleFonts.inter(fontSize: isMobile ? 15 : 17, color: const Color(0xFF94a3b8))),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 40),
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: AspectRatio(aspectRatio: 16 / 9, child: Container(color: Colors.black, child: const Center(child: Icon(Icons.play_arrow, color: Colors.white, size: 48)))),
              ),
              const SizedBox(height: 40),
              const AppFooter(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _drawer(BuildContext context) {
    return Drawer(
      backgroundColor: const Color(0xFF0f172a),
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(gradient: LinearGradient(colors: [Color(0xFFf59e0b), Color(0xFF2563eb)])),
            child: Text('Japa Genie', style: GoogleFonts.inter(fontSize: 24, color: Colors.white)),
          ),
          ..._navLinks.map((l) => ListTile(
                title: Text(l['label']!, style: GoogleFonts.inter(color: Colors.white)),
                onTap: () => Navigator.pushNamed(context, l['route']!),
              )),
          const Divider(color: Colors.white24),
          ListTile(title: Text('Log In', style: GoogleFonts.inter(color: Colors.white)), onTap: () => Navigator.pushNamed(context, '/login')),
          ListTile(title: Text('Get Started', style: GoogleFonts.inter(color: Colors.white)), onTap: () => Navigator.pushNamed(context, '/kyc')),
        ],
      ),
    );
  }
}
