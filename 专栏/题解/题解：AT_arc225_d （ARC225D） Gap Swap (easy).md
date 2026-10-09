## 思路



相当于去掉 $p_i=i$ 后的逆序对，然后冒泡过去到对应的位置，每个位置造成的贡献是 $\frac{|p_i-i|}{2}$ 而总贡献为每个位置贡献之和。



## 代码



```cpp

#include <bits/stdc++.h>

#define int long long

using namespace std;

const int maxn = 5e5 + 5;

int n, a[maxn], ans; 

signed main() {

	ios::sync_with_stdio(0);

	cin.tie(0), cout.tie(0);

	cin >> n;

	for (int i = 1; i <= n; i++) {

		cin >> a[i];

		ans += abs(i - a[i]);

	}

	ans >>= 1;

	cout << ans << '\n';

	return 0;

}



```

