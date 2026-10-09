## 结论



将树结构中叶子的概念放在图中，我们把度数为 $1$ 的结点成为叶子，这道题有一个关键结论：



> $n\ge 4$ 时，若一个连通图有完美划分，当且仅当每一个非叶子结点都与一个叶子节点相邻。



证明必要性：假设一个结点 $u$ 是非叶子结点且没有叶子邻居。因为 $u$ 不是叶子所以有两个邻居，这样就有两种划分方式：一是将 $u$ 与两个邻居放入一个块中，二是将 $u$ 与其中一个放入一个块中，另一个放入其他块。这样不符合我们的唯一性，矛盾，必要性得证。



证明充分性：每个叶子 $v$ 都必将与所挂着的唯一连接 $u$ 在一个块中，而其他非叶子结点若在一个块中，则最长距离不小于 $3$，所以说存在唯一完美方案，即将叶子节点和其唯一连接的结点划分为若干个块。



## 计数



现在变成计数问题，设有 $m$ 个叶子节点，有 $k=n-m$ 个非叶子结点，在 $n$ 个结点中选择 $m$ 个叶子有 $\binom{n}{k}$ 种方案。



要将 $m$ 有标号的叶子结点分配给 $k$ 个有标号的非叶子结点有 $k!\left\{ {n \atop k} \right\}$ 种。



最后，设有标号的 $k$ 个非叶子结点要组成树或连通图，方案数记为 $f(k)$。当要组成树时根据 Cayley 公式 $f(k)=k^{k-2}$；当要组成图时 $f(k) =2^{\binom{n}{2}}-\sum_{i=1}^{k-1}\binom{n-1}{i-1}f(i)2^{\binom{n-i}{2}}$ 本质正难则反的容斥。



答案为 $\sum_{i=1}^{n-1}\binom{n}{i}i!\left\{ {n \atop i} \right\}f(i)$。



## 细节



因为不保证 $p$ 是素数，所以使用递推的方式求组合数和第二类斯特林数。对于 $n\le 3$ 的特判，每个答案也要取模。



## 代码



```cpp

#include <bits/stdc++.h>

#define int long long

#define fi first

#define se second

using namespace std;

const int maxn = 5005;

int T, p, t, n, ans[maxn];

int C[maxn][maxn], fac[maxn], S[maxn][maxn], f[maxn], pw[maxn];

int ksm(int a, int b) {

	int res = 1;

	while (b) {

		if (b & 1) res = res * a % p;

		a = a * a % p, b >>= 1;

	}

	return res;

}

signed main() {

	ios::sync_with_stdio(0);

	cin.tie(0), cout.tie(0);

	cin >> T >> p >> t; 

	S[0][0] = 1;

	for (int i = 1; i <= 5000; i++) {

		for (int j = 0; j <= i; j++) {

			if (i == j || j == 0) C[i][j] = 1;

			else C[i][j] = (C[i - 1][j] + C[i - 1][j - 1]) % p;

			if (j == 0) S[i][j] = 0;

			else S[i][j] = (S[i - 1][j - 1] + j * S[i - 1][j] % p) % p;

		}

	}

	fac[0] = pw[0] = 1;

	for (int i = 1; i <= 5000; i++) {

		fac[i] = fac[i - 1] * i % p;

		pw[i] = pw[i - 1] * ksm(2, i - 1) % p;

	}

	if (t) {

		f[1] = 1;

		for (int i = 2; i <= 5000; i++) {

			f[i] = pw[i];

			for (int j = 1; j < i; j++) {

				int now = C[i - 1][j - 1] * f[j] % p;

				now = now * pw[i - j] % p;

				f[i] = (f[i] - now + p) % p;

			}

		}

	} else {

		f[1] = 1;

		for (int i = 2; i <= 5000; i++) {

			f[i] = ksm(i, i - 2);

		}

	}

	for (int i = 1; i <= 5000; i++) {

		for (int k = 1; k <= i / 2; k++) {

			int m = i - k, now = C[i][k] * S[m][k] % p;

			now = now * fac[k] % p;

			now = now * f[k] % p;

			ans[i] = (ans[i] + now) % p;

		}

	}

	while (T--) {

		cin >> n;

		if (n == 1) {

			cout << 0 << '\n';

			continue;

		} 

		if (n == 2) {

			cout << 1 % p << '\n';

			continue;

		}

		if (n == 3) {

			if (t) cout << 4 % p << '\n';

			else cout << 3 % p << '\n';

			continue;

		}

		cout << ans[n] << '\n';

	}

	return 0;

}

```

