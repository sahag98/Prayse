import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { useSelector } from "react-redux";
import { format, parseISO, parse } from "date-fns";

import { Container } from "@components/Container";
import useStore from "@lib/zustand-store";
import { Prayer } from "../../types/reduxTypes";

type TimelineEntry = {
  key: string;
  labelDate: string;
  actions: string[];
  timestamp: number;
  side: "left" | "right";
};

const ProgressScreen = () => {
  const { colorScheme } = useColorScheme();
  const { prayers: prayerDayCounts, verseoftheday, journals } = useStore();
  const prayerEntries = useSelector(
    (state: { prayer?: { prayer?: Prayer[] } }) => state?.prayer?.prayer ?? []
  );
  console.log("prayerEntries: ", prayerEntries);

  const axisColor = colorScheme === "dark" ? "#3f3c87" : "#d0d7ff";
  const cardBackground = colorScheme === "dark" ? "#1d1a38" : "#ffffff";
  const cardBorder = colorScheme === "dark" ? "#3f3c87" : "#d0d7ff";
  const dateColor = colorScheme === "dark" ? "#a7b3ff" : "#4a4f7b";
  const textColor = colorScheme === "dark" ? "#f0f2ff" : "#1f1d34";
  const dotColor = colorScheme === "dark" ? "#6e6af3" : "#4f46e5";

  const timeline = useMemo<TimelineEntry[]>(() => {
    const dayMap = new Map<
      string,
      { labelDate: string; actions: string[]; timestamp: number }
    >();

    const ensureEntry = (date: Date) => {
      if (Number.isNaN(date.getTime())) {
        return null;
      }
      const key = format(date, "yyyy-MM-dd");
      const existing = dayMap.get(key);
      if (existing) {
        existing.timestamp = Math.max(existing.timestamp, date.getTime());
        return existing;
      }
      const nextEntry = {
        labelDate: format(date, "EEEE • MMMM d, yyyy"),
        actions: [] as string[],
        timestamp: date.getTime(),
      };
      dayMap.set(key, nextEntry);
      return nextEntry;
    };

    const parseMaybeDate = (value?: string) => {
      if (!value) return null;
      const normalized = value
        .replace(/\u202f|\u00a0|\u2007|\u2009/g, " ")
        .trim();

      const isoAttempt = parseISO(normalized);
      if (!Number.isNaN(isoAttempt.getTime())) {
        return isoAttempt;
      }

      const compact = normalized.replace(",", "");
      const candidates = [
        "M/d/yyyy, h:mm:ss a",
        "M/d/yyyy h:mm:ss a",
        "M/d/yyyy, h:mm a",
        "M/d/yyyy h:mm a",
      ];

      for (const pattern of candidates) {
        const parsed = parse(normalized, pattern, new Date());
        if (!Number.isNaN(parsed.getTime())) {
          return parsed;
        }
      }

      for (const pattern of candidates) {
        const parsed = parse(compact, pattern, new Date());
        if (!Number.isNaN(parsed.getTime())) {
          return parsed;
        }
      }

      const fallback = new Date(normalized);
      if (!Number.isNaN(fallback.getTime())) {
        return fallback;
      }

      const fallbackCompact = new Date(compact);
      return Number.isNaN(fallbackCompact.getTime()) ? null : fallbackCompact;
    };

    prayerDayCounts.forEach((item) => {
      const parsed = parseISO(item.date);
      const entry = ensureEntry(parsed);
      if (entry) {
        entry.actions.push(
          item.count > 1 ? `Prayed (${item.count})` : "Prayed once"
        );
      }
    });

    prayerEntries.forEach((prayer: Prayer) => {
      const parsed =
        parseMaybeDate(prayer?.answeredDate) ??
        parseMaybeDate(prayer?.date) ??
        parseMaybeDate(prayer?.createdAt) ??
        parseMaybeDate(prayer?.created_at);
      const entry = parsed ? ensureEntry(parsed) : null;
      if (entry) {
        const baseLabel = prayer?.prayer
          ? `Prayed for ${prayer.prayer}`
          : "Prayed";
        const meta: string[] = [];
        if (prayer?.status && prayer.status !== "Active") {
          meta.push(prayer.status);
        }

        const label = meta.length
          ? `${baseLabel} • ${meta.join(" • ")}`
          : baseLabel;
        entry.actions.push(label);
      }
    });

    verseoftheday.forEach((item) => {
      const parsed = parseISO(item.date);
      const entry = ensureEntry(parsed);
      if (entry) {
        entry.actions.push("Saved Verse of the Day");
      }
    });

    journals.forEach((journal) => {
      const parsed = new Date(journal.date);
      const entry = ensureEntry(parsed);
      if (entry) {
        entry.actions.push(
          journal.title ? `Journaled: ${journal.title}` : "Journaled"
        );
      }
    });

    const sorted = Array.from(dayMap.entries())
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => b.timestamp - a.timestamp);

    return sorted.map((item, index) => ({
      ...item,
      side: index % 2 === 0 ? "left" : "right",
    }));
  }, [journals, prayerDayCounts, prayerEntries, verseoftheday]);

  console.log("timeline: ", JSON.stringify(timeline, null, 2));

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 py-8"
      >
        <View className="mb-6 gap-2">
          <Text
            className="font-inter-bold text-3xl"
            style={{ color: textColor }}
          >
            Progress
          </Text>
          <Text
            className="font-inter-medium text-sm leading-5"
            style={{ color: dateColor }}
          >
            See the moments you&apos;ve captured and celebrated.
          </Text>
        </View>
        <View style={styles.timelineWrapper}>
          <View style={[styles.axis, { backgroundColor: axisColor }]} />
          {timeline.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: textColor }]}>
                No moments yet
              </Text>
              <Text style={[styles.emptyDescription, { color: dateColor }]}>
                As you pray, journal, and save verses, they&apos;ll appear here
                to remind you of the journey you&apos;re on.
              </Text>
            </View>
          ) : (
            timeline.map((entry, index) => (
              <View
                key={entry.key}
                style={[
                  styles.eventRow,
                  entry.side === "left" && styles.rowReversed,
                ]}
              >
                <View
                  style={[
                    styles.half,
                    entry.side === "left" ? styles.alignEnd : styles.alignStart,
                  ]}
                >
                  {entry.side === "left" && (
                    <Card
                      dateColor={dateColor}
                      textColor={textColor}
                      axisColor={axisColor}
                      cardBackground={cardBackground}
                      cardBorder={cardBorder}
                      entry={entry}
                      side="left"
                    />
                  )}
                </View>

                <View
                  style={[
                    styles.half,
                    entry.side === "right"
                      ? styles.alignStart
                      : styles.alignEnd,
                  ]}
                >
                  {entry.side === "right" && (
                    <Card
                      dateColor={dateColor}
                      textColor={textColor}
                      axisColor={axisColor}
                      cardBackground={cardBackground}
                      cardBorder={cardBorder}
                      entry={entry}
                      side="right"
                    />
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </Container>
  );
};

type CardProps = {
  entry: TimelineEntry;
  dateColor: string;
  textColor: string;
  axisColor: string;
  cardBackground: string;
  cardBorder: string;
  side: "left" | "right";
};

const Card = ({
  entry,
  dateColor,
  textColor,
  axisColor,
  cardBackground,
  cardBorder,
  side,
}: CardProps) => {
  return (
    <View style={styles.cardWrapper}>
      <Text
        className="font-inter-semibold text-xs uppercase tracking-[0.8px]"
        style={{ color: dateColor }}
      >
        {entry.labelDate}
      </Text>
      <View
        style={[styles.branchRow, side === "left" && styles.branchRowReversed]}
      >
        <View style={[styles.branchLine, { backgroundColor: axisColor }]} />
        <View
          style={[
            styles.card,
            {
              backgroundColor: cardBackground,
              borderColor: cardBorder,
            },
          ]}
        >
          {entry.actions.map((action, idx) => (
            <Text
              key={`${entry.key}-${idx}`}
              className="font-inter-medium text-base"
              style={{ color: textColor }}
            >
              {action}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineWrapper: {
    position: "relative",
    paddingBottom: 48,
  },
  axis: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    left: "50%",
    marginLeft: -1,
    opacity: 0.5,
  },
  emptyState: {
    marginTop: 32,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
    backgroundColor: "rgba(79, 70, 229, 0.04)",
    gap: 8,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
  },
  emptyDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    minHeight: 80,
  },
  rowReversed: {
    flexDirection: "row-reverse",
  },
  half: {
    flex: 1,
    paddingHorizontal: 12,
  },
  alignEnd: {
    alignItems: "flex-end",
  },
  alignStart: {
    alignItems: "flex-start",
  },
  middleColumn: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrapper: {
    maxWidth: "100%",
    gap: 8,
  },
  branchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  branchRowReversed: {
    flexDirection: "row-reverse",
  },
  branchLine: {
    height: 2,
    width: 32,
    opacity: 0.6,
  },
  card: {
    flexGrow: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 2,
    gap: 6,
  },
});

export default ProgressScreen;
