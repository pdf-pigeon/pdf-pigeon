# PDF Pigeon

HTML to PDF in under 2 seconds

![Screenshot of Swagger UI](/images/screenshot.png)

## Usage

```shell
curl -X 'POST' \
  'https://pdfpigeon.com/api/v1/render/pdf' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "url": "https://example.com"
}' -o output.pdf
```

## Run Locally

```bash
git clone https://github.com/pdf-pigeon/pdf-pigeon.git

cd pdf-pigeon

npm install

npm run dev

# open http://localhost:8080 in your browser
```

## Run in Kubernetes

```bash
kubectl apply -f https://raw.githubusercontent.com/pdf-pigeon/pdf-pigeon/main/pdf-pigeon.yaml
```

## Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/pdf-pigeon/pdf-pigeon/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/pdf-pigeon/pdf-pigeon/pull) to add new features/make quality-of-life improvements/fix bugs.
