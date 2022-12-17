package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

var client http.Client
var secret = ""
var application string
var baseUrl string

func init() {
	godotenv.Load()
	application = os.Getenv("PROXY_APPLICATION")
	baseUrl = os.Getenv("PROXY_BASE_URL")
}

func parseJson[T ProxyRequest](body T, reader io.Reader) (T, error) {
	decoder := json.NewDecoder(reader)
	err := decoder.Decode(&body)
	if err != nil {
		return T{}, err
	}

	return body, err
}

func request[T ProxyRequest](url string, params map[string]interface{}, response T) (T, error) {
	reqUrl := baseUrl + "/" + url

	req, err := http.NewRequest("GET", reqUrl, nil)
	if err != nil {
		fmt.Println(err.Error())
	}

	q := req.URL.Query()
	q.Add("application", application)
	for key, value := range params {
		q.Add(key, fmt.Sprintf("%v", value))
	}

	req.URL.RawQuery = q.Encode()

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println(err.Error())
	}

	defer res.Body.Close()
	return parseJson(response, res.Body)
}
