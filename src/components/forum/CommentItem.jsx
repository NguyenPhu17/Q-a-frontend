export default function CommentItem({ comment }) {
    const user = comment.User || {};

    const getRelativeTime = (dateString) => {
        const now = new Date();
        const commentDate = new Date(dateString);
        const diff = (now - commentDate) / 1000;

        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return `${Math.floor(diff / 86400)} ngày trước`;
    };

    return (
        <div className="flex space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
            <img
                src={user.avt || '/default-avatar.png'}
                alt={user.name || 'Ẩn danh'}
                className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex-1">
                <div className="flex items-center space-x-3">
                    <p className="font-semibold text-blue-600">{user.name || 'Ẩn danh'}</p>
                    <span className="text-gray-400 text-sm">{getRelativeTime(comment.created_at)}</span>
                </div>
                <p className="mt-1 text-gray-800 whitespace-pre-line">{comment.content}</p>
            </div>
        </div>
    );
}