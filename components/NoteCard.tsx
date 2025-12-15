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
                <View style={styles.row}>
                    <Text style={styles.date}>{dateStr}</Text>
                    <Text style={styles.preview} numberOfLines={1}>
                        {note.content.replace(/[#*`]/g, '') || 'No additional text'}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#c7c7cc', // iOS separator color
        flexDirection: 'column',
        gap: 4,
    },
    pressed: {
        backgroundColor: '#f2f2f7',
    },
    content: {
        gap: 2,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    preview: {
        fontSize: 15,
        color: '#8e8e93', // iOS secondary label
        lineHeight: 20,
    },
    date: {
        fontSize: 14,
        color: '#8e8e93',
        marginRight: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
    }
});
