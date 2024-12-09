import * as Yup from "yup";

export const UserValidationSchema = Yup.object()
  .shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    fullName: Yup.string().required("Full name is required"),
    currentPassword: Yup.string().optional(),
    newPassword: Yup.string()
      .optional()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
        message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
        excludeEmptyString: true,
      }),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .optional(),
  })
  .test("passwords-match", "Both current and new passwords are required when changing password", function (value) {
    const { currentPassword, newPassword } = value;
    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      return this.createError({ path: "newPassword", message: "Both current and new passwords are required" });
    }
    return true;
  });
