from models.user import User

class UserRepository:

    def __init__(self, db):
        self.db = db

    def find_by_cod_empleado(self, cod):
        return self.db.query(User).filter(User.cod_empleado == cod).first()