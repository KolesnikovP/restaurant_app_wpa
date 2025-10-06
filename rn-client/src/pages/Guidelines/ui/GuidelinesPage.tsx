import { View, Text } from 'react-native';
import { Card } from '@/shared/ui/Card';

export default function GuidelinesPage() {
  return (
    <View style={{ paddingHorizontal: 16, gap: 12 }}>
      <Card title="Guidelines">
        <Text style={{ color: '#cbd5e1', fontSize: 13 }}>Guidelines: no data source yet.</Text>
      </Card>
    </View>
  );
}

