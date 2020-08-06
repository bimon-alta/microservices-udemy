import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';


const router = express.Router();

router.post('/api/users/signup', [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20})
      .withMessage('Password must be between 4 and 20 characters')
  ], 
  async (req: Request, res: Response) =>{   //diberikan tipe req as Request, res as Response, karena ini typeScript
    //hasil proses validasi pada array di atas akan dipass ke request lagi dgn object validationResult
    const errors = validationResult(req);

    if (!errors.isEmpty()){
      throw new RequestValidationError(errors.array());
    }
  
    // const { email, password } = req.body;

    // if (!email || typeof email !== 'string'){
    //   res.status(400).send('Provide a valid email please');
    // }

    //Pengecekan apakah email yg akan didaftarkan sudah ada di Database ?
    const { email, password } = req.body;
    // jika ketemu akan dikembalikan sebagai object, jika tdk ketemu akan bernilai NULL
    const existingUser = await User.findOne({ email });
    
    if (existingUser){
      // console.log('Email in use');
      // return res.send({});
      throw new BadRequestError('Email is already in use')
    }

    const user = User.build({ email, password });
    await user.save();

    res.status(201).send(user);

  }
);

export { router as signupRouter };