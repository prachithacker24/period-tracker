import hashlib
import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    sha_hash = hashlib.sha256(plain_password.encode()).hexdigest()
    return bcrypt.checkpw(sha_hash[:72].encode(), hashed_password.encode())


def get_password_hash(password: str) -> str:
    """Hash a password for storage."""
    # Step 1: Pre-hash using SHA256
    sha_hash = hashlib.sha256(password.encode()).hexdigest()

    # Step 2: Then bcrypt (truncate to 72 bytes to satisfy bcrypt limit)
    # Note: Using bcrypt directly as passlib is unmaintained and fails on Python 3.12
    password_bytes = sha_hash[:72].encode()
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt)
    return hashed_password.decode()
