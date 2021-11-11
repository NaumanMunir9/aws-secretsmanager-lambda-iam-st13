import * as cdk from "@aws-cdk/core";
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // SecretsManager Construct
    const secret = new secretsmanager.Secret(this, "Secret", {
      description: "My Secret",
      secretName: "example-secret",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({}),
        generateStringKey: "SecretKey",
      },
    });

    // This will rotate after every 24 hours
    const lambdaFn = new lambda.Function(this, "LambdaFnSecretRotate", {
      functionName: "lambda-secret-keys-rotate",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "index.handler",
      environment: {
        REGION: cdk.Stack.of(this).region,
        SECRET_NAME: "example-secret",
        KEY_IN_SECRET_NAME: "SecretKey",
      },
    });
  }
}
