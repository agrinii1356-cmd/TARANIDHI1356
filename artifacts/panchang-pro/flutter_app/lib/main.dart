import 'package:flutter/material.dart';

void main() {
  runApp(const PanchangProApp());
}

class PanchangProApp extends StatelessWidget {
  const PanchangProApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PanchangPro',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF312E81),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        fontFamily: 'Poppins',
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF312E81),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    DashboardTab(),
    MuhuratTab(),
    PanchangTab(),
    ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.search), selectedIcon: Icon(Icons.search), label: 'Muhurat'),
          NavigationDestination(icon: Icon(Icons.calendar_today_outlined), selectedIcon: Icon(Icons.calendar_today), label: 'Panchang'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

class DashboardTab extends StatelessWidget {
  const DashboardTab({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar.large(
          title: const Text('PanchangPro'),
          backgroundColor: const Color(0xFF1E1B4B),
          foregroundColor: Colors.white,
        ),
        SliverPadding(
          padding: const EdgeInsets.all(16),
          sliver: SliverList(
            delegate: SliverChildListDelegate([
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('आज का स्कोर', style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Text('78', style: Theme.of(context).textTheme.displaySmall?.copyWith(
                            color: Colors.green, fontWeight: FontWeight.bold,
                          )),
                          const SizedBox(width: 12),
                          const Chip(label: Text('Good'), backgroundColor: Color(0xFFDCFCE7)),
                        ],
                      ),
                      const Text('Tara Bala: Sampat · Chandra Bala strong'),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text('Quick Actions', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _actionChip(context, 'Job Interview', Icons.work),
                  _actionChip(context, 'Business Deal', Icons.handshake),
                  _actionChip(context, 'Travel', Icons.flight),
                  _actionChip(context, 'Health', Icons.medical_services),
                  _actionChip(context, 'Finance', Icons.account_balance),
                  _actionChip(context, 'Meeting', Icons.video_call),
                ],
              ),
            ]),
          ),
        ),
      ],
    );
  }

  Widget _actionChip(BuildContext context, String label, IconData icon) {
    return ActionChip(
      avatar: Icon(icon, size: 18),
      label: Text(label),
      onPressed: () {},
    );
  }
}

class MuhuratTab extends StatelessWidget {
  const MuhuratTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Muhurat Search')),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text(
            'Intent-based Muhurat Search\n\nConnect to FastAPI backend\nPOST /api/v1/muhurat/search',
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}

class PanchangTab extends StatelessWidget {
  const PanchangTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Daily Panchang')),
      body: const Center(
        child: Text('Daily Panchang + Rahu Kaal + Hora\nGET /api/v1/panchang/daily'),
      ),
    );
  }
}

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Chart')),
      body: const Center(
        child: Text('Birth Chart · Janma Nakshatra · Family Members'),
      ),
    );
  }
}
