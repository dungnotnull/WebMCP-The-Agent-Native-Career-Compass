import { CareerSuggestion, RoadmapMilestone, TrajectoryPath } from '../types';

/**
 * Generates and triggers a real download of an iCalendar (.ics) file
 * containing all milestone learning schedules for Google Calendar / Apple Calendar.
 */
export function downloadMilestoneCalendarICS(
  careerTitle: string,
  milestones: RoadmapMilestone[]
) {
  const now = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatICSDate = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//La Ban//AI Career Compass Vietnam 2026//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:La Bàn - Lộ trình nâng cấp kỹ năng AI'
  ];

  let currentStartDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // starts tomorrow

  milestones.forEach((m, idx) => {
    const durationDays = (m.weeksDuration || 2) * 7;
    const endDate = new Date(currentStartDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const uid = `laban-milestone-${idx + 1}-${Date.now()}@laban.vn`;
    const summary = `[La Bàn] Giai đoạn ${m.milestoneNumber}: ${m.titleVi}`;
    const description = `Mục tiêu: ${m.phaseNameVi}\\nKỹ năng: ${m.skillsCovered.join(', ')}\\nThời lượng: ${m.estimatedHours} giờ (~${m.weeksDuration} tuần)\\nNền tảng La Bàn AI Career Compass Vietnam.`;

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatICSDate(now)}`,
      `DTSTART:${formatICSDate(currentStartDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );

    // Increment start date for the next milestone
    currentStartDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `La_Ban_Roadmap_${careerTitle.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and triggers download of CSV formatted for Google Sheets or Excel
 */
export function downloadTrajectoryCSV(
  careerTitle: string,
  trajectories: TrajectoryPath[]
) {
  const years = ['2026 (Hiện tại)', '2027 (+1 Năm)', '2028 (+2 Năm)', '2029 (+3 Năm)', '2030 (+4 Năm)'];
  
  let csv = '\uFEFF'; // UTF-8 BOM for Excel Vietnamese characters
  csv += 'Lo trinh,Ti le Kha thi (%),Muc do Rui ro,Thoi gian (Thang),Thu nhap 2026,Thu nhap 2027,Thu nhap 2028,Thu nhap 2029,Thu nhap 2030,Vi tri Muc tieu\n';

  trajectories.forEach((t) => {
    const row = [
      `"${t.pathTitleVi}"`,
      `${t.feasibilityScore}%`,
      `"${t.riskLevel}"`,
      `${t.estimatedTimelineMonths}`,
      ...t.fiveYearSalaryProjection.map(s => `${s} Triệu VND`),
      `"${t.targetRoles.join('; ')}"`
    ];
    csv += row.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `La_Ban_Salary_Projection_${careerTitle.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Text-to-Speech briefing reader using standard browser SpeechSynthesis
 */
export class SpeechBriefingController {
  private static synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  public static speak(
    text: string,
    onEnd?: () => void,
    onError?: () => void
  ): boolean {
    if (!this.synth) return false;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to find a Vietnamese voice if available
    const voices = this.synth.getVoices();
    const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VI'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      if (onError) onError();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  public static stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public static isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}
