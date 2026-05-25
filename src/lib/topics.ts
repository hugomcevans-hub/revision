"use client";
import { Note } from "@/types";
import { store } from "./store";

/** Topics = notes. Each note is a topic. */
export interface Topic {
  noteId: string;
  title: string;
  subject: string;
}

export function listTopics(subject?: string): Topic[] {
  return store
    .getNotes()
    .filter((n) => !subject || subject === "All" || n.subject === subject)
    .map((n: Note) => ({ noteId: n.id, title: n.title, subject: n.subject }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getNoteIdToSubject(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const n of store.getNotes()) map[n.id] = n.subject;
  return map;
}

export function getNoteById(noteId: string): Note | undefined {
  return store.getNotes().find((n) => n.id === noteId);
}
