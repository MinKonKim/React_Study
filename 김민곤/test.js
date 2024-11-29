function solution(targets) {
  var answer = 0;

  const sortedTargets = targets.sort((a, b) => a[1] - b[1]);

  let end = 1;
  sortedTargets.forEach((target) => {
    if (end >= target[0] && end < target[1]) {
      answer++;
    } else {
      end = target[1];
    }
  });
  return answer;
}
