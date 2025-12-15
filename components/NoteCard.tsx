import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Note {
    id: string;
    title: string;
    content: string;
    updatedAt: number;
}

import { theme } from '../constants/theme';

interface NoteCardProps {
    note: Note;
}

export const NoteCard = ({ note }: NoteCardProps) => {
    const router = useRouter();

    const handlePress = () => {
        router.push(`/note/${note.id}`);
    };

    const dateStr = new Date(Number(note.updatedAt)).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric'
    });

    return (
        <Pressable onPress={handlePress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{note.title || 'Untitled Note'}</Text>
                <Text style={styles.preview} numberOfLines={2}>
                    {note.content.replace(/[#*`]/g, '') || 'No additional text'}
                </Text>
                <Text style={styles.date}>{dateStr}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.s,
        borderRadius: 0, // Square corners
    },
    pressed: {
        backgroundColor: theme.colors.secondaryBackground,
    },
    content: {
        gap: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        letterSpacing: -0.5,
    },
    preview: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    date: {
        fontSize: 12,
        color: '#888',
        marginTop: 8,
        alignSelf: 'flex-end',
    },
});
