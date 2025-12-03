import 'package:flutter_test/flutter_test.dart';
import 'package:japa_mobile/main.dart';

void main() {
  testWidgets('Landing page loads', (WidgetTester tester) async {
    await tester.pumpWidget(const JapaGenieApp());
    expect(find.text('STOP Getting Scammed'), findsOneWidget);
  });
}