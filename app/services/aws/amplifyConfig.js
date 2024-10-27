// app/services/aws/amplifyConfig.js
import Amplify from "aws-amplify";
import awsExports from "../../../aws-exports"; // Ensure the path is correct

Amplify.configure(awsExports);
