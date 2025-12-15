import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NoteCard } from '../../components/NoteCard';
import { getNotes, initDatabase } from '../../services/db';

export default function HomeScreen() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      await initDatabase(); // Ensure DB is ready
      const data = await getNotes();
      setNotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  const handleCreateNote = () => {
    router.push(`/note/${Date.now().toString()}`); // Use timestamp as temporary ID or generated ID
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notes</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoteCard note={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No notes yet</Text>
            </View>
          }
        />
      )}

      <Pressable style={styles.fab} onPress={handleCreateNote}>
        <Ionicons name="create-outline" size={28} color="#FEA00A" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60, // Safe area ish
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    // No background, just icon style for minimal
    // Or minimal circle
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  }
});
