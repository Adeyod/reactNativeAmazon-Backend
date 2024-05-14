import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { verifyEmail } from '../utils/nodemailer.js';
import Token from '../models/tokenModel.js';
import { generateToken } from '../utils/jwtAuth.js';
import { response } from 'express';

const forbiddenCharsRegex = /[|!{}()&=[\]===><>]/;

const tokenGenerator = () => {
  const token = Math.floor(Math.random() * 1000000);
  return token;
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        error: 'All fields are required',
        status: 400,
        success: false,
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (forbiddenCharsRegex.test(trimmedName)) {
      return res.json({
        error: 'Invalid character for field name',
        success: false,
        status: 400,
      });
    }

    // check the email field to prevent input of unwanted characters
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.json({
        error: 'Invalid input for email...',
        status: 400,
        success: false,
      });
    }

    // // strong password check
    if (
      !/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,20}$/.test(
        password
      )
    ) {
      return res.json({
        error:
          'Password must contain at least 1 special character, 1 lowercase letter, and 1 uppercase letter. Also it must be minimum of 8 characters and maximum of 20 characters',
        success: false,
        status: 401,
      });
    }

    // if (password !== confirmPassword) {
    //   return res.json({
    //     message: 'Password and confirm password do not match',
    //     status: 400,
    //     success: false,
    //   });
    // }

    const userExist = await User.findOne({
      email: trimmedEmail,
    });

    if (userExist) {
      return res.json({
        error: 'User already exist',
        status: 400,
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = tokenGenerator();

    const user = await new User({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
    }).save();

    const newToken = await new Token({
      token: verificationToken,
      userId: user.id,
    }).save();

    if (!user) {
      return res.json({
        error: 'Unable to create user',
        success: false,
        status: 400,
      });
    }
    // const token =
    //   crypto.randomBytes(32).toString('hex') +
    //   crypto.randomBytes(32).toString('hex');

    // const newToken = await new Token({
    //   token,
    //   userId: user._id,
    // }).save();

    // const link = `${process.env.FRONTEND_URL}/user-verification/?userId=${newToken.userId}&token=${newToken.token}`;
    // const link = `${process.env.FRONTEND_URL}/api/user/user-verification/${newToken.userId}/${newToken.token}`;

    // await verifyEmail(link, user.email);
    await verifyEmail(user.email, newToken.token);

    return res.json({
      message: 'Email verification link has been sent to your email address',
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.json({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};

const emailVerification = async (req, res) => {
  try {
    const token = req.params.token;

    const tokenExist = await Token.findOne({ token });
    if (!tokenExist) {
      return res.json({
        error: 'Invalid token',
        success: false,
        status: 404,
      });
    }

    const user = await User.findOne({ _id: tokenExist.userId });
    if (!user) {
      return res.json({
        error: 'User not found',
        success: false,
        status: 404,
      });
    }

    user.verified = true;

    await tokenExist.deleteOne();

    await user.save();

    return res.json({
      message: 'Verification successful. You can now login',
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.json({
      error: error.message,
      status: 500,
      success: false,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({
        error: 'All fields are required',
        status: 400,
        success: false,
      });
    }

    const trimmedEmail = email.trim();

    // check the email field to prevent input of unwanted characters
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.json({
        error: 'Invalid input for email...',
        status: 400,
        success: false,
      });
    }

    // // strong password check
    if (
      !/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,20}$/.test(
        password
      )
    ) {
      return res.json({
        error:
          'Password must contain at least 1 special character, 1 lowercase letter, and 1 uppercase letter. Also it must be minimum of 8 characters and maximum of 20 characters',
        success: false,
        status: 401,
      });
    }

    const userExist = await User.findOne({
      email: trimmedEmail,
    });

    if (!userExist) {
      return res.json({
        error: 'Invalid credentials',
        success: false,
        status: 400,
      });
    }

    const confirmPassword = await bcrypt.compare(password, userExist.password);

    if (!confirmPassword) {
      return res.json({
        error: 'Invalid credentials',
        success: false,
        status: 400,
      });
    }

    if (userExist.verified === false) {
      // check if there is valid token
      const validToken = await Token.findOne({
        userId: userExist._id,
      });

      if (validToken) {
        await verifyEmail(userExist.email, validToken.token);
        return res.json({
          error:
            'Please verify your email with the link sent to your email address',
        });
      }

      const token = tokenGenerator();

      const newToken = await new Token({
        token,
        userId: userExist._id,
      }).save();

      await verifyEmail(userExist.email, newToken.token);

      return res.json({
        error: 'Please verify your email address',
      });
    }

    const { password: hashedPassword, ...others } = userExist._doc;

    const accessToken = await generateToken(
      userExist._id,
      userExist.email,
      res
    );

    return res.json({
      message: 'Login successful',
      status: 200,
      success: true,
      user: others,
      token: accessToken,
    });
  } catch (error) {
    return res.json({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};

const addAddresses = async (req, res) => {
  try {
    const { userId, address } = req.body;

    const { name, mobileNo, houseNo, street, landmark, postalCode } = address;

    console.log('req', req.body);
    if (!name || !mobileNo || !houseNo || !street || !landmark || !postalCode) {
      return res.json({
        error: 'All fields are required',
        status: 400,
        success: false,
      });
    }

    const trimmedName = name.trim();
    const trimmedMobileNo = mobileNo.trim();
    const trimmedHouseNo = houseNo.trim();
    const trimmedStreet = street.trim();
    const trimmedLandmark = landmark.trim();

    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.json({
        error: 'User not found',
        status: 404,
        success: false,
      });
    }

    const addressToSave = {
      postalCode,
      landmark: trimmedLandmark,
      street: trimmedStreet,
      name: trimmedName,
      houseNo: trimmedHouseNo,
      mobileNo: trimmedMobileNo,
    };

    user.addresses.push(addressToSave);
    const saved = await user.save();

    if (!saved) {
      return res.json({
        error: 'Unable to save address',
        status: 400,
        success: false,
      });
    } else {
      return res.json({
        message: 'Added address successfully',
        status: 200,
        success: true,
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
      status: 500,
      success: false,
    });
  }
};

// endpoint to get all the addresses of a particular user
const getAllAddresses = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.json({
        error: 'User not found',
        status: 404,
        success: false,
      });
    } else {
      return res.json({
        message: 'Addresses found successfully',
        status: 200,
        success: true,
        addresses: user.addresses,
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
      status: 500,
      success: false,
    });
  }
};

// get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.json({
        error: 'User not found',
        status: 404,
        success: false,
      });
    } else {
      const { password, ...others } = user._doc;
      return res.json({
        message: 'User found successfully',
        status: 200,
        success: true,
        user: others,
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      status: 500,
    });
  }
};

export {
  getAllAddresses,
  addAddresses,
  loginUser,
  registerUser,
  emailVerification,
  getUserProfile,
};
