import type { UserIntakeProfile } from '../src/types';
import { GOLDEN_PROFILES } from '../src/data/goldenProfiles';

export interface EvalPersona {
  id: string;
  label: string;
  intake: UserIntakeProfile;
  challenging?: boolean;
}

const p = (
  id: string,
  label: string,
  intake: UserIntakeProfile,
  challenging = false
): EvalPersona => ({ id, label, intake, challenging });

export const EVAL_PERSONAS: EvalPersona[] = [
  // 3 golden personas reused from the platform's demo set
  ...GOLDEN_PROFILES.map((g, i) => p(`persona-golden-${i + 1}`, g.name, g.intakeProfile)),

  // 9 synthetic personas covering diverse Vietnamese worker situations
  p('persona-accountant', 'Minh Anh - Accountant', {
    currentRole: 'Kế toán tổng hợp',
    experienceYears: 6,
    education: 'Cử nhân Kế toán (ĐH Kinh tế Quốc dân)',
    location: 'Hà Nội',
    currentSkills: ['Excel nâng cao', 'Phần mềm MISA', 'Thủ thuật thuế', 'Kiểm soát chứng từ'],
    strengths: ['Cẩn thận, chi tiết', 'Nắm vững quy trình kế toán', 'Tư duy tuân thủ quy định'],
    weaknesses: ['Chưa biết dùng công cụ phân tích dữ liệu', 'Kỹ năng trình bày số liệu còn yếu'],
    interests: ['Phân tích tài chính', 'Công nghệ số'],
    forecastMode: 'realistic',
    constraints: { budgetVND: 4000000, hoursPerWeekAvailable: 10, riskTolerance: 'low' }
  }),
  p('persona-garment', 'Thùy Dung - Garment Worker', {
    currentRole: 'Công nhân may công nghiệp',
    experienceYears: 8,
    education: 'Trung học phổ thông',
    location: 'Bình Dương',
    currentSkills: ['Vận hành máy may công nghiệp', 'Đọc bản vẽ kỹ thuật', 'Kiểm tra chất lượng sản phẩm'],
    strengths: ['Khéo tay', 'Chịu được áp lực đơn hàng', 'Làm việc nhóm theo chuyền'],
    weaknesses: ['Ít tiếp xúc máy tính', 'Tiếng Anh hạn chế'],
    interests: ['Kinh doanh nhỏ', 'Nghề thủ công'],
    forecastMode: 'conservative',
    constraints: { budgetVND: 2000000, hoursPerWeekAvailable: 6, riskTolerance: 'low' }
  }),
  p('persona-teacher', 'Thu Hà - High School Teacher', {
    currentRole: 'Giáo viên Ngữ văn cấp 3',
    experienceYears: 12,
    education: 'Thạc sĩ Sư phạm Ngữ văn',
    location: 'Đà Nẵng',
    currentSkills: ['Thiết kế bài giảng', 'Quản lý lớp học', 'Đánh giá học sinh', 'Truyền cảm hứng'],
    strengths: ['Giao tiếp xuất sắc', 'Tư duy phản biện', 'Kiến thức nhân văn sâu'],
    weaknesses: ['Chưa ứng dụng AI vào giảng dạy', 'Kỹ năng số cơ bản'],
    interests: ['Giáo dục công nghệ', 'Viết nội dung', 'Tâm lý học'],
    forecastMode: 'realistic',
    constraints: { budgetVND: 3000000, hoursPerWeekAvailable: 8, riskTolerance: 'moderate' }
  }),
  p('persona-juniordev', 'Quang Huy - Junior Developer', {
    currentRole: 'Lập trình viên Front-end (junior)',
    experienceYears: 1.5,
    education: 'Cử nhân CNTT (ĐH FPT)',
    location: 'TP. Hồ Chí Minh',
    currentSkills: ['React', 'TypeScript', 'HTML/CSS', 'Git'],
    strengths: ['Học nhanh công nghệ mới', 'Tự học chủ động'],
    weaknesses: ['Chưa có kinh nghiệm hệ thống lớn', 'Tiếng Anh kỹ thuật trung bình'],
    interests: ['AI/ML', 'Agent phát triển', 'Sản phẩm số'],
    forecastMode: 'optimistic',
    constraints: { budgetVND: 5000000, hoursPerWeekAvailable: 15, riskTolerance: 'high' }
  }),
  p('persona-student', 'Bảo Ngọc - Final Year Student', {
    currentRole: 'Sinh viên năm cuối ngành Marketing',
    experienceYears: 0,
    education: 'Sinh viên Đại học Kinh tế TP.HCM (sắp tốt nghiệp)',
    location: 'TP. Hồ Chí Minh',
    currentSkills: ['Content cơ bản', 'Canva', 'Social media'],
    strengths: ['Nhiệt tình', 'Bắt trend nhanh', 'Tiếng Anh giao tiếp tốt'],
    weaknesses: ['Chưa có kinh nghiệm thực tế', 'Chưa thành thạo công cụ phân tích'],
    interests: ['Digital marketing', 'AI content', 'Thương hiệu'],
    forecastMode: 'optimistic',
    constraints: { budgetVND: 2000000, hoursPerWeekAvailable: 20, riskTolerance: 'high' }
  }),
  p('persona-nurse', 'Lan Anh - Nurse', {
    currentRole: 'Điều dưỡng viên',
    experienceYears: 7,
    education: 'Cử nhân Điều dưỡng',
    location: 'Cần Thơ',
    currentSkills: ['Chăm sóc bệnh nhân', 'Tiêm truyền', 'Hồ sơ bệnh án điện tử'],
    strengths: ['Kiên nhẫn', 'Xử lý tình huống cấp cứu', 'Giao tiếp với bệnh nhân'],
    weaknesses: ['Áp lực ca trực', 'Ít cơ hội học công nghệ mới'],
    interests: ['Y tế số', 'Sức khỏe cộng đồng'],
    forecastMode: 'realistic',
    constraints: { budgetVND: 2500000, hoursPerWeekAvailable: 5, riskTolerance: 'low' }
  }),
  p('persona-logistics', 'Văn Đức - Logistics Coordinator', {
    currentRole: 'Điều phối logistics xuất nhập khẩu',
    experienceYears: 5,
    education: 'Cử nhân Ngoại thương',
    location: 'Hải Phòng',
    currentSkills: ['Khai báo hải quan', 'Điều phối container', 'Excel', 'Giao tiếp nhà cung cấp'],
    strengths: ['Tổ chức tốt', 'Xử lý văn bản nhanh', 'Tiếng Anh thương mại'],
    weaknesses: ['Quy trình còn thủ công', 'Chưa số hóa báo cáo'],
    interests: ['Chuỗi cung ứng số', 'Phân tích dữ liệu vận hành'],
    forecastMode: 'realistic',
    constraints: { budgetVND: 3500000, hoursPerWeekAvailable: 8, riskTolerance: 'moderate' }
  }),
  p('persona-farmer', 'Văn Bình - Rice Farmer', {
    currentRole: 'Nông dân trồng lúa',
    experienceYears: 20,
    education: 'Tiểu học',
    location: 'An Giang',
    currentSkills: ['Canh tác lúa theo mùa', 'Quản lý nước ruộng', 'Bán lúa cho thu mua'],
    strengths: ['Kinh nghiệm địa phương sâu', 'Chăm chỉ', 'Vượt qua điều kiện khắc nghiệt'],
    weaknesses: ['Mù chữ công nghệ', 'Không tiếng Anh', 'Phụ thuộc thương lái'],
    interests: ['Nông nghiệp sạch', 'Kinh doanh nông sản'],
    forecastMode: 'conservative',
    constraints: { budgetVND: 1000000, hoursPerWeekAvailable: 4, riskTolerance: 'low' }
  }),

  // Challenging case: obscure occupation absent from the curated DB.
  // Expected honest behavior: weak/no occupation match, verifier flags missing
  // direct evidence, agent generalizes from adjacent occupations.
  p('persona-watchrepair', 'Đình Phúc - Watch Repairer', {
    currentRole: 'Thợ sửa chữa đồng hồ cơ',
    experienceYears: 15,
    education: 'Trung cấp kỹ thuật',
    location: 'Hà Nội',
    currentSkills: ['Sửa máy đồng hồ cơ', 'Đánh bóng vỏ', 'Phân biệt linh kiện Swiss/Japanese'],
    strengths: ['Độ chính xác tay nghề cao', 'Kiên nhẫn tuyệt đối', 'Uy tín với khách quen'],
    weaknesses: ['Thị trường đang thu hẹp', 'Không bán hàng online', 'Tuổi cao khó chuyển nghề'],
    interests: ['Đồng hồ cao cấp', 'Khởi nghiệp nhỏ'],
    forecastMode: 'conservative',
    constraints: { budgetVND: 3000000, hoursPerWeekAvailable: 6, riskTolerance: 'low' }
  }, true)
];
