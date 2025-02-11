import bcrypt from 'bcryptjs'

export async function hashPassword(password: string) {
    // Define the number of salt rounds
    const saltRounds = 10;
  
    try {
      // Generate a salt
      const salt = await  bcrypt.genSalt(saltRounds);
  
      // Hash the password with the salt
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Return the hashed password
      return hashedPassword;
    } catch (err) {
      // Handle errors
      console.error(err);
    }
  }
  