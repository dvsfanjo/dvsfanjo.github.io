## BSGS 大步小步算法



BSGS 是用来求解形似



$$a^x\equiv b \bmod m$$



的同余方程，其中 $m$ 是素数。



## 原理



考虑根号平衡，令 $n =  \lceil \sqrt m \rceil$ ， $x=An+B$ 。



我们的问题被转换为：



$$a^B\equiv b\times a^{-An} \bmod m$$



枚举 $A$ 和 $B$ ，Baby Step 是指枚举 $B$ 并将 $a^B$ 存入哈希表， Gaint Step 是枚举 $A$ 使 $b\times a^{-An}$ 与哈希表中的 $a^B$ 匹配。



没有匹配到就是无解，反之解为 $x=An+B$ 。



值得注意的是，枚举 $A$ 和 $B$ 的范围为 $[0,n)$ ，因为次数 $i$ 超过 $n$ 次后 $a_i$ 就会有循环，这便是 BSGS 算法的精髓，时间复杂度为 $O(\sqrt m)$ （因为使用 ```unordered_map``` 是 $O(1)$ 的）。



## 代码



```cpp

ll BSGS(ll a, ll b, ll m) {

	int n = ceil(sqrt(m));

	unordered_map <ll, ll> mp;

	int val = 1;

	for (int i = 0; i < n; i++) {

		mp[val] = i;

		val = val * a % m;

	}

	int inv = ksm(ksm(a, n), m - 2);

	val = b;

	for (int i = 0; i < n; i++) {

		if (mp.count(val)) {

			return i * n + mp[val];

		} val = val * inv % m;

	} return -1;

}

```

