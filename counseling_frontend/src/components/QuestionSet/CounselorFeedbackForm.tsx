import { useForm } from 'react-hook-form'
import axios from 'axios'

// defining the typescript interface for the form data
interface FeedbackFormData {
  studentId: string;
  studentName: string;
  counselorId: string;
  counselorName: string;
  answerId: string ; // MUST BE HERE
  onFeedbackSaved: () => void;
}

interface FeedbackFormInputs {
  feedbackTitle: string;
  feedbackText: string;
}

function CounselorFeedbackForm({
  studentId,
  studentName,
  counselorId,
  counselorName,
  answerId,
  onFeedbackSaved
}: FeedbackFormData) {

  const { register, handleSubmit, reset } = useForm<FeedbackFormInputs>();

  const onSubmit = async (data: FeedbackFormInputs) => {
    // if (!studentId || !counselorId || !answerId) {
    //   console.error("Missing required IDs", {
    //     answerId,
    //     studentId,
    //     counselorId
    //   })
    //   alert("Cannot submit feedback: missing required IDs");
    //   return;
    // }

    try {
      const accessToken = localStorage.getItem("accessToken");

      console.log("Submitting feedback:", { studentId, counselorId, answerId, data });

      await axios.put(
        `http://localhost:3000/api/counselor/feedback/${answerId}`, // ✅ NOW DEFINED
        {
          studentId,
          counselorId,
          counselorName,
          feedbackTitle: data.feedbackTitle,
          answerId,
          feedbackText: data.feedbackText
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("Feedback saved successfully!");
      reset();
      onFeedbackSaved();

    } catch (error) {
      console.error("Error saving feedback:", error);
      alert("Failed to save feedback. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="feedback-form-container my-5">
      <div className="form-header mt-3">
        <h2 className="form-title">Counselor Feedback Form</h2>
        <div className="header-decoration"></div>
      </div>

      <div className="form-body">
        <div className="info-grid">
          <div className="info-card">
            <label className="info-label">Student</label>
            <p className="info-value">{studentName}</p>
            <div className="card-accent"></div>
          </div>

          <div className="info-card">
            <label className="info-label">Counselor</label>
            <p className="info-value">{counselorName}</p>
            <div className="card-accent"></div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Feedback Title <span className="required">*</span>
          </label>
          <input
            type="text"
            {...register("feedbackTitle", { required: true })}
            placeholder="Enter a brief title for your feedback..."
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Detailed Feedback <span className="required">*</span>
          </label>
          <textarea
            {...register("feedbackText", { required: true })}
            placeholder="Write your detailed feedback here..."
            rows={6}
            className="form-textarea"
          />
          <div className="character-hint">Provide comprehensive feedback to help the student improve</div>
        </div>
      </div>

      <div className="form-footer">
        <button
          type="submit"
          className="submit-button"
        >
          <span className="button-text">Submit Feedback</span>
          <i className='bx bx-right-arrow-alt button-icon'></i>
        </button>
      </div>
    </form>
  )
}

export default CounselorFeedbackForm;
