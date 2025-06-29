import requests

def fetch_indicator_world(indicator_code):
    country_code = "WLD"  # World aggregate data
    url = f"https://api.worldbank.org/v2/country/{country_code}/indicator/{indicator_code}?format=json"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data and len(data) > 1 and data[1]:
            latest_entry = None
            for entry in data[1]:
                value = entry.get('value')
                if value is not None:
                    if (latest_entry is None) or (int(entry.get('date')) > int(latest_entry.get('date'))):
                        latest_entry = entry
            if latest_entry:
                year = latest_entry.get('date')
                value = latest_entry.get('value')
                print(f"Year: {year}, Value: {value}")
    else:
        print(f"Request failed with status code {response.status_code}")

indicators = {
    'Forest Area (% of Land Area)': 'AG.LND.FRST.ZS'
}

for name, code in indicators.items():
    print(f"\n{name}:")
    fetch_indicator_world(code)
