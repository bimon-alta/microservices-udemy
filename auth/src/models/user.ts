import mongoose from 'mongoose';
import { Password } from '../services/password';

// INTERFACE utk memastikan object/model yg dibuat bisa diidentifikasi properti dan tipe nya
// An interface that describe the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  
}


const userSchema = new mongoose.Schema({
  email: {
    type: String,       //type utk mongoose ORM merupakan constructor (Class), bedakan dgn tipe data string pada typescript => const email: string
    required: true
  },
  password:{
    type: String,
    required: true
  }
});

//deklarasi yg menjelaskan bahwa sebelum method 'save' dipanggil, method ini akan dijalankan duluan
//melakukan hashing tepat ketika method `save` dipanggil dan sebelum diproses
userSchema.pre('save', async function(done){    //kenapa tidak pakai arrow function? Tujuannya karena scope `this` yg ingin kita gunakan disini adalah scope local
  if (this.isModified('password')){
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});


// teknik/trik hack Moongose-Typescript, utk membuat User baru --- lebih advanced
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// teknik/trik hack Moongose-Typescript, utk membuat User baru
// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };


export { User };