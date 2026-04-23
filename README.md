# Focus_ai

## Launch before configuration

In the `infra/azure` folder you need to create your own `terraform.tfvars` file. You will find all the necessary keys in the `terraform.tfvars.samle` file.
In the main folder needs to create `.env` file. You can see a sample `sample.env` file here


## How to run infrastructure

1. `terraform init`
2. `terraform plan`
3. `tarraform apply`

With using `cloud-init.yaml` file that Docker runs automatically in VM


