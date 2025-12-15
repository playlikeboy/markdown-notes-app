import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Note {
    id: string;
    title: string;
    content: string;
    updatedAt: number;
}

interface NoteCardProps {
    note: Note;
}

export const NoteCard = ({ note }: NoteCardProps) => {
    const router = useRouter();

    const handlePress = () => {
        router.push(`/note/${note.id}`);
    };

    const dateStr = new Date(note.updatedAt).toLocaleDateString();

    return (
        <Pressable onPress={handlePress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{note.title || 'Untitled'}</Text>
                <Text style={styles.preview} numberOfLines={2}>
                    {note.content || 'No content'}
                </Text>
                <Text style={styles.date}>{dateStr}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        // Elevation for Android
        elevation: 2,
    },
    pressed: {
        opacity: 0.7,
    },
    content: {
        gap: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    preview: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
});
