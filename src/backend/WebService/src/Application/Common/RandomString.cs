using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common
{
    public class RandomString
    {
        public static string GenerateRandomPassword(int length)
        {
            const string lowerCase = "abcdefghijklmnopqrstuvwxyz";
            const string upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string numbers = "0123456789";
            const string special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

            var chars = new List<char>();
            var rnd = new Random();

            // Ensure at least one of each required character type
            chars.Add(lowerCase[rnd.Next(lowerCase.Length)]);
            chars.Add(upperCase[rnd.Next(upperCase.Length)]);
            chars.Add(numbers[rnd.Next(numbers.Length)]);
            chars.Add(special[rnd.Next(special.Length)]);

            // Fill the rest with random characters from all types
            string allChars = lowerCase + upperCase + numbers + special;
            for (int i = chars.Count; i < length; i++)
            {
            chars.Add(allChars[rnd.Next(allChars.Length)]);
            }

            // Shuffle the characters
            return new string(chars.OrderBy(x => rnd.Next()).ToArray());
        }
    }
}