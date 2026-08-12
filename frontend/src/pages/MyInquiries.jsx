import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const MyInquiries = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(user?.role === "owner" ? "received" : "sent");
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  const fetchInquiries = async (which) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/inquiries/${which}`);
      setInquiries(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries(tab);
  }, [tab]);

  const handleReply = async (id) => {
    const reply = replyText[id];
    if (!reply) return;
    try {
      await api.put(`/inquiries/${id}/reply`, { reply });
      fetchInquiries(tab);
      setReplyText({ ...replyText, [id]: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Inquiries</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("sent")}
          className={`px-4 py-2 rounded-lg font-medium ${
            tab === "sent" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Sent by Me
        </button>
        <button
          onClick={() => setTab("received")}
          className={`px-4 py-2 rounded-lg font-medium ${
            tab === "received" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Received (as Owner)
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : inquiries.length === 0 ? (
        <p className="text-gray-500">No inquiries here yet.</p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div key={inq._id} className="bg-white shadow-sm rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <Link
                  to={`/properties/${inq.property?._id}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {inq.property?.title}
                </Link>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    inq.status === "replied"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {inq.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {tab === "sent" ? `To: ${inq.receiver?.name}` : `From: ${inq.sender?.name} (${inq.sender?.email})`}
              </p>
              <p className="text-gray-700 mb-3">{inq.message}</p>

              {inq.reply && (
                <div className="bg-gray-50 border-l-4 border-primary p-3 rounded mb-3">
                  <p className="text-sm text-gray-500 mb-1">Reply:</p>
                  <p className="text-gray-800">{inq.reply}</p>
                </div>
              )}

              {tab === "received" && inq.status !== "replied" && (
                <div className="flex gap-2 mt-2">
                  <input
                    className="input-field flex-1"
                    placeholder="Write a reply..."
                    value={replyText[inq._id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [inq._id]: e.target.value })}
                  />
                  <button onClick={() => handleReply(inq._id)} className="btn-primary">
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInquiries;
