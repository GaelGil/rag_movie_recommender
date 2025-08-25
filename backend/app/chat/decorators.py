from functools import wraps
from flask import session
from app.chat.services import ChatService


def chat_service_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Get existing chat_session_id from Flask session
        # none if not set
        user_id = session.get("user_id")
        chat_session_id = session.get("chat_session_id")

        print(f"DEBUG chat_session_id: {chat_session_id}")

        # Create or load ChatService
        chat_service = ChatService(
            user_id=user_id,
            session_id=chat_session_id,
        )

        # Store session_id in Flask session for future requests
        session["chat_session_id"] = chat_service.session_id

        return f(chat_service, *args, **kwargs)

    return decorated
