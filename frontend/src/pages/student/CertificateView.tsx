import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, Download, Printer, ChevronLeft, Loader2, ShieldCheck } from 'lucide-react';
import { certificatesService } from '../../services/progress.service';
import type { Certificate, User, Course } from '../../types';
import toast from 'react-hot-toast';

export default function CertificateView() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await certificatesService.getByCourse(courseId!);
                setCertificate(res.data.data);
            } catch (error) {
                toast.error('Certificate not found');
                navigate('/student/certificates');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [courseId, navigate]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    if (!certificate) return null;

    const student = certificate.studentId as User;
    const course = certificate.courseId as Course;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 flex flex-col items-center">
            {/* Controls - Hidden on Print */}
            <div className="print:hidden w-full max-w-5xl flex justify-between items-center mb-8">
                <button
                    onClick={() => navigate('/student/certificates')}
                    className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition"
                >
                    <ChevronLeft className="w-4 h-4" /> Back to Certificates
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm"
                    >
                        <Printer className="w-4 h-4" /> Print Certificate
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        <Download className="w-4 h-4" /> Save as PDF
                    </button>
                </div>
            </div>

            {/* Certificate Canvas */}
            <div className="w-full max-w-[1000px] aspect-[1.414/1] bg-white text-slate-900 shadow-2xl rounded-sm relative overflow-hidden p-1 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]">
                {/* Border Frame */}
                <div className="w-full h-full border-[1.5rem] border-double border-amber-200 p-8 flex flex-col items-center justify-between relative">

                    {/* Corner Ornaments */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-400 opacity-40"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-400 opacity-40"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-400 opacity-40"></div>
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-400 opacity-40"></div>

                    {/* Header */}
                    <div className="text-center mt-12">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <ShieldCheck className="w-16 h-16 text-amber-500" />
                                <div className="absolute -top-1 -right-1 bg-white p-0.5 rounded-full">
                                    <Award className="w-6 h-6 text-indigo-600" />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-5xl font-serif tracking-[0.2em] text-slate-800 uppercase mb-4">Certificate</h1>
                        <h2 className="text-xl font-medium tracking-widest text-amber-600 uppercase">of achievement</h2>
                    </div>

                    {/* Body */}
                    <div className="text-center w-full px-20">
                        <p className="font-serif italic text-lg text-slate-500 mb-8">This is to certify that</p>
                        <h3 className="text-4xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2 inline-block min-w-[300px] mb-8">
                            {student.name}
                        </h3>
                        <p className="font-serif italic text-lg text-slate-500 mb-8">has successfully completed the course</p>
                        <h4 className="text-3xl font-extrabold text-indigo-900 uppercase tracking-wide mb-12">
                            {course.title}
                        </h4>
                    </div>

                    {/* Footer */}
                    <div className="w-full px-16 flex justify-between items-end mb-12">
                        <div className="text-center">
                            <div className="font-serif italic border-b border-slate-300 px-8 text-xl mb-1">LearnHub Team</div>
                            <div className="text-xs uppercase tracking-widest font-bold text-slate-400">Issuing Authority</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2">
                                {/* Simplified representation of a QR code or seal */}
                                <div className="w-16 h-16 flex flex-wrap gap-0.5 opacity-40">
                                    {Array.from({ length: 16 }).map((_, i) => (
                                        <div key={i} className={`w-3.5 h-3.5 ${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-transparent'}`}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Verification Code: {certificate.certificateCode}</div>
                        </div>

                        <div className="text-center">
                            <div className="font-serif italic border-b border-slate-300 px-8 text-xl mb-1">
                                {new Date(certificate.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div className="text-xs uppercase tracking-widest font-bold text-slate-400">Date of Issue</div>
                        </div>
                    </div>

                    {/* Decorative Seal Background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]">
                        <Award className="w-[500px] h-[500px]" />
                    </div>
                </div>
            </div>

            {/* Verification Notice */}
            <div className="print:hidden mt-12 text-center text-slate-500 max-w-lg">
                <p className="text-sm">
                    This is a verifiable digital certificate issued by LearnHub.
                    The verification code <strong>{certificate.certificateCode}</strong> can be used to validate the authenticity of this achievement.
                </p>
            </div>

            {/* Print Settings Helper */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: landscape;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        background: white !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            ` }} />
        </div>
    );
}
