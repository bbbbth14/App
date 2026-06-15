import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import questions from './data/questions.json';

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

export default function App() {
  const sessionQuestions = useMemo(() => shuffle(questions).slice(0, 20), []);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplain, setShowExplain] = useState(false);

  const q = sessionQuestions[index];
  const isDone = index >= sessionQuestions.length;

  const onSelect = (optIndex) => {
    if (selected !== null) return;
    setSelected(optIndex);
    setShowExplain(true);
    if (optIndex === q.a) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    if (index + 1 >= sessionQuestions.length) {
      setIndex(sessionQuestions.length);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setShowExplain(false);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setShowExplain(false);
  };

  if (isDone) {
    const percent = Math.round((score / sessionQuestions.length) * 100);
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.container}>
          <Text style={styles.title}>Olympia Vietnam 2026</Text>
          <Text style={styles.result}>Kết quả: {score}/{sessionQuestions.length}</Text>
          <Text style={styles.resultSub}>Độ chính xác: {percent}%</Text>
          <Pressable style={styles.nextBtn} onPress={restart}>
            <Text style={styles.nextText}>Làm lại 20 câu mới</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Olympia Vietnam 2026</Text>
        <Text style={styles.meta}>Hard only • Vietnam only • {questions.length} câu</Text>
        <Text style={styles.progress}>Câu {index + 1}/{sessionQuestions.length} • Điểm {score}</Text>

        <View style={styles.card}>
          <Text style={styles.question}>{q.q}</Text>

          {q.o.map((opt, i) => {
            const isCorrect = i === q.a;
            const isSelected = i === selected;
            const disabled = selected !== null;
            const style = [styles.option];
            if (disabled && isCorrect) style.push(styles.correct);
            if (disabled && isSelected && !isCorrect) style.push(styles.wrong);

            return (
              <Pressable key={String(i)} style={style} onPress={() => onSelect(i)}>
                <Text style={styles.optionText}>{String.fromCharCode(65 + i)}. {opt}</Text>
              </Pressable>
            );
          })}

          {showExplain && (
            <View style={styles.explainBox}>
              <Text style={styles.answerLine}>Đáp án đúng: {String.fromCharCode(65 + q.a)}. {q.o[q.a]}</Text>
              <Text style={styles.explain}>{q.e}</Text>
            </View>
          )}
        </View>

        <Pressable style={[styles.nextBtn, selected === null && styles.nextDisabled]} disabled={selected === null} onPress={next}>
          <Text style={styles.nextText}>{index + 1 === sessionQuestions.length ? 'Xem kết quả' : 'Câu tiếp theo'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#020617'
  },
  container: {
    padding: 16,
    paddingBottom: 28
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4
  },
  meta: {
    color: '#cbd5e1',
    marginBottom: 10
  },
  progress: {
    color: '#a5b4fc',
    fontWeight: '700',
    marginBottom: 14
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  question: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 12
  },
  option: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  optionText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '600'
  },
  correct: {
    backgroundColor: '#14532d',
    borderColor: '#22c55e'
  },
  wrong: {
    backgroundColor: '#7f1d1d',
    borderColor: '#ef4444'
  },
  explainBox: {
    marginTop: 8,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  answerLine: {
    color: '#34d399',
    fontWeight: '800',
    marginBottom: 6
  },
  explain: {
    color: '#d1d5db',
    lineHeight: 20
  },
  nextBtn: {
    marginTop: 16,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center'
  },
  nextDisabled: {
    opacity: 0.45
  },
  nextText: {
    color: '#eff6ff',
    fontWeight: '800',
    fontSize: 16
  },
  result: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16
  },
  resultSub: {
    color: '#93c5fd',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 20
  }
});
