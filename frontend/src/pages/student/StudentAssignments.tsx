import { useState, useEffect } from "react";
import { FileText, Upload, CheckCircle, Clock } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { useParams } from "react-router-dom";
import {
  assignmentsService,
  submissionsService,
} from "../../services/assignments.service";

export default function StudentAssignments() {
  const { courseId } = useParams(); // dynamic course id

  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [texts, setTexts] = useState<{ [key: string]: string }>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // 🔥 Load assignments + submissions
  useEffect(() => {
    const load = async () => {
      try {
        const [assignRes, subRes] = await Promise.all([
          assignmentsService.getByCourse(courseId as string),
          submissionsService.getMySubmissions(),
        ]);

        setAssignments(assignRes.data.data || []);
        setSubmissions(subRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) load();
  }, [courseId]);

  // 🔍 Find submission for an assignment
  const getSubmission = (assignmentId: string) => {
    return submissions.find(
      (s) =>
        s.assignmentId === assignmentId ||
        s.assignmentId?._id === assignmentId
    );
  };

  // 🚀 Submit assignment
  const handleSubmit = async (assignmentId: string) => {
    try {
      setSubmittingId(assignmentId);

      const res = await submissionsService.submit({
        assignmentId,
        textContent: texts[assignmentId],
      });

      alert("Submitted successfully");

      // update UI with real data
      setSubmissions((prev) => [...prev, res.data.data]);

      // clear textarea
      setTexts((prev) => ({ ...prev, [assignmentId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <Layout title="Assignments">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Assignments
        </h1>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 bg-white dark:bg-slate-800 rounded-2xl"
              />
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold">No assignments</h3>
          </div>
        ) : (
          <div className="grid gap-4">
            {assignments.map((a: any) => {
              const submission = getSubmission(a._id);

              return (
                <div
                  key={a._id}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row gap-6 items-center"
                >
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <FileText className="w-8 h-8" />
                  </div>

                  <div className="flex-1 w-full">
                    <span className="text-xs text-indigo-600 block mb-1">
                      {a.course}
                    </span>

                    <h3 className="font-bold text-lg mb-2">{a.title}</h3>

                    <div className="flex gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(a.deadline).toLocaleDateString()}
                      </span>
                      <span>Marks: {a.totalMarks}</span>
                    </div>
                  </div>

                  <div className="w-full md:w-52 flex flex-col gap-2">
                    {!submission ? (
                      <>
                        <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full">
                          Pending
                        </span>

                        <textarea
                          placeholder="Write submission..."
                          value={texts[a._id] || ""}
                          onChange={(e) =>
                            setTexts({
                              ...texts,
                              [a._id]: e.target.value,
                            })
                          }
                          className="p-2 border rounded-lg text-sm"
                        />

                        <button
                          onClick={() => handleSubmit(a._id)}
                          disabled={
                            !texts[a._id] ||
                            submittingId === a._id
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl disabled:opacity-50"
                        >
                          <Upload className="w-4 h-4" />
                          {submittingId === a._id
                            ? "Submitting..."
                            : "Submit"}
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Submitted
                        </span>

                        <div className="bg-gray-50 p-2 rounded text-center">
                          <span className="text-xs text-gray-500 block">
                            Grade
                          </span>
                          <span className="font-bold">
                            {submission.grade ?? "Not graded"} /{" "}
                            {a.totalMarks}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}