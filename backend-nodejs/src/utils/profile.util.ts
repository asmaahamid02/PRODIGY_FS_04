export const generateProfilePictureUrl = (
  username: string,
  gender: string
): string => {
  const genderStr = gender.toLowerCase() === 'male' ? 'boy' : 'girl'
  return `https://avatar.iran.liara.run/public/${genderStr}?username=${username}`
}
