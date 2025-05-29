export default function CommentForm({ value, onChange, onSubmit }) {
    const userAvatarRaw = localStorage.getItem('userAvatar');

    const baseUrl = 'http://localhost:3009';

    const userAvatar = userAvatarRaw
        ? userAvatarRaw.startsWith('http')
            ? userAvatarRaw
            : baseUrl + userAvatarRaw
        : '';

    return (
        <form onSubmit={onSubmit} className="flex items-start space-x-4 mb-6">
            {userAvatar ? (
                <img
                    src={userAvatar}
                    alt="User avatar"
                    className="w-12 h-12 rounded-full object-cover mt-1"
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 mt-1" />
            )}
            <div className="flex-1">
                <textarea
                    value={value}
                    onChange={onChange}
                    rows={3}
                    placeholder="Viết bình luận..."
                    className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                        Gửi
                    </button>
                </div>
            </div>
        </form>
    );
}
