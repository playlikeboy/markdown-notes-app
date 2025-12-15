import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Colors, Text, View } from 'react-native-ui-lib';
import { Note } from '../services/db';

interface NoteCardProps {
    note: Note;
    index: number;
}

export const NoteCard = ({ note, index }: NoteCardProps) => {
    const router = useRouter();

    const handlePress = () => {
        router.push(`/note/${note.id}`);
    };

    // Alternating Card Styles
    // Index 0 -> Blue Card (To-Do style)
    // Others -> Gray Card (Standard)

    const isSpecial = index % 3 === 0; // Every 3rd note is "special/blue"
    const bg = isSpecial ? Colors.cardBlue : Colors.cardGray;
    const isTodo = isSpecial; // Just a visual mock for the design USP

    const dateStr = new Date(Number(note.updatedAt)).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric'
    });

    return (
        <Pressable onPress={handlePress} style={({ pressed }) => [
            styles.card,
            { backgroundColor: bg, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
        ]}>
            {/* Header / Date */}
            <View row spread marginB-8>
                {isTodo && <View style={styles.arrowIcon}><Ionicons name="arrow-up-outline" size={16} color="#FFF" style={{ transform: [{ rotate: '45deg' }] }} /></View>}
                <Text text100 color={Colors.secondary} style={{ fontWeight: '700', textTransform: 'uppercase' }}>{dateStr}</Text>
            </View>

            {/* Title */}
            <Text text60 color={Colors.primary} marginB-12 numberOfLines={2} style={{ fontWeight: '700' }}>
                {note.title || 'Untitled'}
            </Text>

            {/* Content Preview */}
            <View flex>
                {isTodo ? (
                    <View gap-8>
                        <View row centerV bg-white padding-6 br30>
                            <View style={[styles.checkbox, { backgroundColor: Colors.primary }]}><Ionicons name="checkmark" size={10} color="#FFF" /></View>
                            <Text text90 marginL-6>Music courses</Text>
                        </View>
                        <View row centerV bg-white padding-6 br30>
                            <View style={styles.checkbox} />
                            <Text text90 marginL-6>Buy Groceries</Text>
                        </View>
                    </View>
                ) : (
                    <Text text80 color={Colors.secondary} numberOfLines={4}>
                        {note.content.replace(/<[^>]+>/g, '') || 'No text'}
                    </Text>
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1, // Grid item
        borderRadius: 24, // Large rounded
        padding: 16,
        marginBottom: 12, // Gap between rows
        minHeight: 160,
        maxWidth: '48%', // Ensure 2 columns fit with gap
        overflow: 'hidden',
    },
    checkbox: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowIcon: {
        backgroundColor: '#1A1A1A',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
