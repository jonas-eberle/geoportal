for i in *.png; do convert $i -resize '368' ${i%.*}_small.png; done
