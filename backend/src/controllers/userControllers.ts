import {Request , Response} from 'express';
import {Guest} from '@/models/userModel';
import { emailValidation } from '@/utils/emailValidation';

export const guestUserRegister = async (req: Request, res: Response): Promise<void> => {
    try {
        const email: string = req.body.email;

        if(!email) {
            res.status(400).json({
                 message: "Email is undefined."});
            
            return;
        }

        const validEmail: boolean = await emailValidation(email);

        if(!validEmail){
            res.status(400).json({
                message: "Invalid email format. Email has to be in the format of test@gmail.com"
            });

            return;
        }

        const existingGuest = await Guest.findOne({email});

        if(existingGuest){
            res.status(400).json({
                message: "Email already registered."
            });

            return;
        }

        const data = new Guest({
            email: email
        })

        const newGuest = await data.save();

        res.status(201).json({ message: "New guest user registered successfully."})

      } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
        console.log(error);
      }
};

