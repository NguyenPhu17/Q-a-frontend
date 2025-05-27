import { useEffect, useState } from "react";

export default function AdminResetPage() {
    const [requests, setRequests] = useState([]);
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState("");

    const fetchRequests = async () => {
        const res = await fetch("http://localhost:3009/api/admin/reset-requests");
        const data = await res.json();
        setRequests(data);
    };

    const fetchHistory = async () => {
        const res = await fetch("http://localhost:3009/api/admin/reset-history");
        const data = await res.json();
        setHistory(data);
    };

    useEffect(() => {
        fetchRequests();
        fetchHistory();
    }, []);

    const handleConfirm = async (email) => {
        const res = await fetch("http://localhost:3009/api/admin/reset-confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setMessage(data.message);
        fetchRequests();
        fetchHistory();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center space-y-10">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-10">
                <h2 className="text-3xl font-bold text-center text-black mb-8">
                    📝 Danh sách yêu cầu đặt lại mật khẩu
                </h2>

                {requests.length === 0 ? (
                    <p className="text-center text-gray-500">
                        Không có yêu cầu nào đang chờ xử lý.
                    </p>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {requests.map((req) => (
                            <li
                                key={req.id}
                                className="flex justify-between items-center py-4 px-2 hover:bg-gray-50 rounded-lg transition"
                            >
                                <span className="text-gray-800 font-medium">{req.email}</span>
                                <button
                                    onClick={() => handleConfirm(req.email)}
                                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150"
                                >
                                    ✅ Xác nhận
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {message && (
                    <div className="mt-6 text-center">
                        <p className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
                            {message}
                        </p>
                    </div>
                )}
            </div>

            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-10">
                <h2 className="text-3xl font-bold text-center text-black mb-8">
                    📜 Lịch sử xử lý yêu cầu
                </h2>

                {history.length === 0 ? (
                    <p className="text-center text-gray-500">
                        Chưa có yêu cầu nào được xử lý.
                    </p>
                ) : (
                    <ul className="space-y-4">
                        {history.map((item) => (
                            <li
                                key={item.id}
                                className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm"
                            >
                                <span className="text-gray-800">{item.email}</span>
                                <span className="text-gray-400 text-sm">
                                    {new Date(item.updated_at).toLocaleString("vi-VN")}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}