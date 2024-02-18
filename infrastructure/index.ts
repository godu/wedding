import * as pulumi from '@pulumi/pulumi';
import * as awsnative from '@pulumi/aws-native';
import * as aws from '@pulumi/aws';
import * as syncedFolder from '@pulumi/synced-folder';


const githubConfig = new pulumi.Config('github');
const organizationName = githubConfig.require('owner');

const accountId = awsnative.getAccountId().then(({ accountId }) => accountId);
const stack = pulumi.getStack();
const tags = [{
  key: 'Stack',
  value: stack,
}];

const githubOidcProviderArn = accountId.then(accountId => awsnative.iam.getOidcProvider({
  arn: `arn:aws:iam::${accountId}:oidc-provider/token.actions.githubusercontent.com`
})).then(({ arn }) => arn ?? '');

const weddingGithubActionAssumeRole = new aws.iam.Role(
  'weddingGithubActionAssumeRole',
  {
    assumeRolePolicy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: 'sts:AssumeRoleWithWebIdentity',
          Principal: {
            Federated: githubOidcProviderArn,
          },
          Condition: {
            StringEquals: {
              'token.actions.githubusercontent.com:aud': ['sts.amazonaws.com'],
            },
            StringLike: {
              'token.actions.githubusercontent.com:sub': [
                'repo',
                `${organizationName}/wedding`,
                '*',
              ].join(':'),
            },
          },
        },
      ],
    },
  },
);

const weddingPulumiStateBucket = new awsnative.s3.Bucket('wedding-pulumi-state-bucket', { tags }, { protect: true });
export const weddingPulumiStateBucketName = weddingPulumiStateBucket.bucketName;

new aws.iam.RolePolicy('WeddingGithubActionAssumeRolePolicy', {
	role: weddingGithubActionAssumeRole.id,
	policy: {
		Version: '2012-10-17',
		Statement: [
			{
				Effect: 'Allow',
				Action: ['s3:*'],
				Resource: [
					pulumi.interpolate`arn:aws:s3:::${weddingPulumiStateBucket.id}`,
					pulumi.interpolate`arn:aws:s3:::${weddingPulumiStateBucket.id}/*`,
				],
			},
			{
				Effect: 'Allow',
				Action: ['cloudformation:*', 'iam:*', 'lambda:*', 's3:*', 'cloudfront:*'],
				Resource: ['*'],
			},
		],
	},
});

export const weddingGithubActionAssumeRoleArn = weddingGithubActionAssumeRole.arn


const weddingBucket = new awsnative.s3.Bucket('wedding', {tags});

new syncedFolder.S3BucketFolder('WeddingS3BucketFolder', {
	bucketName: weddingBucket.id,
	path: '../dist',
	managedObjects: false,
	acl: 'private',
});

const weddingOriginAccessControl = new awsnative.cloudfront.OriginAccessControl('WeddingOriginAccessControl', {
	originAccessControlConfig: {
		name: 'wedding-origin-access-control',
		originAccessControlOriginType: 's3',
		signingBehavior: 'always',
		signingProtocol: 'sigv4',
	},
});

const CACHING_OPTIMIZED = '658327ea-f89d-4fab-a63d-7e88639e58f6';

const weddingDistribution = new awsnative.cloudfront.Distribution('WeddingDistribution', {
	distributionConfig: {
		enabled: true,
		priceClass: 'PriceClass_100',
		httpVersion: 'http2and3',
		defaultRootObject: 'index.html',
		defaultCacheBehavior: {
			targetOriginId: 'wedding-bucket',
			compress: true,
			viewerProtocolPolicy: 'redirect-to-https',
			allowedMethods: [
				'GET',
				'HEAD',
				'OPTIONS',
			],
			cachePolicyId: CACHING_OPTIMIZED,
		},
		origins: [{
			id: 'wedding-bucket',
			domainName: weddingBucket.regionalDomainName,
			originAccessControlId: weddingOriginAccessControl.id,
			s3OriginConfig: {},
		}],
	},
});

new awsnative.s3.BucketPolicy('WeddingBucketPolicy', {
	bucket: weddingBucket.id,
	policyDocument: {
		Version: '2008-10-17',
		Statement: [
			{
				Effect: 'Allow',
				Principal: {
					Service: 'cloudfront.amazonaws.com',
				},
				Action: 's3:GetObject',
				Resource: pulumi.interpolate`${weddingBucket.arn}/*`,
				Condition: {
					StringEquals: {
						'AWS:SourceArn': pulumi.interpolate`arn:aws:cloudfront::${accountId}:distribution/${weddingDistribution.id}`,
					},
				},
			},
		],
	},
});
