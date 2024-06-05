import { Html, Heading, Text } from "@react-email/components"
const EmailTemplate = ({
  name,
  url
}) => {
  return (
    <Html lang="en">
      <Heading as="h1">New Space Invitation !</Heading>
      <Text>{name} just invited you on a space.</Text>
      <Text>Join now !</Text>
      <Text><a href={url} target="_blank" >{url}</a></Text>
      <Text></Text>
    </Html>
  )
}
export default EmailTemplate