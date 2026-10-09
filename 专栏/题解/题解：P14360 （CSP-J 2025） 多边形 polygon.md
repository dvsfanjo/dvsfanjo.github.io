## 考场思路



考虑到我们既要维护子集和，又要维护子集最值，考虑排序，这样就可以把最值固定下来，只研究子集和。



排完序后，对于 $l_i$，我们要在 $[1,i]$ 中选一个子集 $\{p_1,p_2...p_k,i\}$ 使得以其为下标的元素综合大于 $2l_i$，即 $\{p_1...p_k\}$ 为下标的元素综合大于 $l_i$。



维护综合大于 $l_i$ 的子集数量太过于麻烦，正难则反，我们考虑维护小于等于 $l_i$ 的子集数量。



设 $f_{i,j}$ 为下标属于 $[1,i]$ 的，子集之和等于 $j$ 的子集数量，有一个类似背包的转移式：



$f_{i,j}=f_{i-1,j}+f_{i-1,j-l_i}$



对每一个 $f_i$ 做前缀和，得到的 $f_{i,j}$ 就是总和小于等于 $j$ 的集合数量，大于 $j$ 的集合数量便为 $2^i-f_{i,j}$。



按题意统计答案即可，这里可以天然满足找出来的子集元素个数大于等于 $2$，这里不多过赘述。



## 代码



```cpp

#include <bits/stdc++.h>

using namespace std;

using ll = long long;

const int maxn = 5005, p = 998244353;

ll n, V, ans, a[maxn], f[maxn][maxn], pw[maxn] = {1}; 

ll calc(ll i) {

	return (pw[i - 1] - f[i - 1][a[i]] + p) % p;

}

int main() {

	ios::sync_with_stdio(0);

	cin.tie(0); cout.tie(0);

	cin >> n;

	for (int i = 1; i <= n; i++) {

		cin >> a[i];

		V = max(V, a[i]);

		pw[i] = pw[i - 1] * 2 % p;

	}

	sort(a + 1, a + n + 1);

	f[0][0] = 1;

	for (int i = 1; i <= n; i++) {

		for (int j = 0; j <= V; j++) {

			f[i][j] = f[i - 1][j];

			if (j >= a[i]) f[i][j] = (f[i][j] + f[i - 1][j - a[i]]) % p;

		}

	}

	for (int i = 1; i <= n; i++) {

		for (int j = 1; j <= V; j++) {

			f[i][j] = (f[i][j] + f[i][j - 1]) % p;

		}

	}

	for (int i = 3; i <= n; i++) {

		ans = (ans + calc(i)) % p;

	}

	cout << ans << '\n';

	return 0;

}

```

