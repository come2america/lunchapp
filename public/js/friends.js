var names1 = ["Beastie Boys",
"Run DMC",
"Public Enemy",
"N.W.A",
"Eric B. & Rakim"
]
var names2 = ["LL Cool J",
"Grandmaster Flash & the Furious Five",
"Boogie Down Productions",
"EPMD",
"De La So"]
var names3 = ["The Notorious B.I.G",
"2Pac",
"Nas",
"Scarface",
"Jay-Z",
"Andre 3000",
"Snoop Dogg"]
var names4 = [
"Ice Cube",
"Big Boi",
"Lauryn Hill",
"Redman",
"Method Man"]

var names5 = [
"Eminem",
"Kanye West",
"T.I",
"Young Jeezy",
"50 cent",
"Fabolous",
"Snoop Dogg",
]
var names6 = ["Bow Bow",
"Lil Wayne",
"Ludacris",
"Andre 3000",
"Nelly",
"Busta Rhymes"
]
var names7 = [
"Lupe Fiasco",
"Pusha T",
"Big K.R.I.T",
"Freddie Gibbs",
"Danny Brown",
"Rick Ross",
"J. Cole"
]
var names8 = ["Kendrick Lamar",
"Drake",
"Big Sean",
"The Game",
"Logic"
]
var names9 = [
"Jay Rock",
"Young Thug",
"Rae Sremmurd",
"Mac Miller",
"Logic",
"Meek Mill",
]
var names10 = ["Rapsody",
"Tyler, The Creator",
"Lil Uzi Vert",
"Future",
"Migos",
"Nikki Minaj"]


for (var i = 0; i < names1.length; i++) {
var selnames1 = names1[Math.floor(Math.random() * names1.length)]
$("#singer1").text(selnames1)
}
for (var i = 0; i < names2.length; i++) {

var selnames2 = names2[Math.floor(Math.random() * names2.length)]


$("#singer2").text(selnames2)

}
for (var i = 0; i < names3.length; i++) {
var selnames3 = names3[Math.floor(Math.random() * names3.length)]
$("#singer3").text(selnames3)
}
for (var i = 0; i < names4.length; i++) {

var selnames4 = names4[Math.floor(Math.random() * names4.length)]


$("#singer4").text(selnames4)

}
for (var i = 0; i < names5.length; i++) {
var selnames5 = names5[Math.floor(Math.random() * names5.length)]
$("#singer5").text(selnames5)
}
for (var i = 0; i < names6.length; i++) {

var selnames6 = names6[Math.floor(Math.random() * names6.length)]


$("#singer6").text(selnames6)

}

for (var i = 0; i < names7.length; i++) {
var selnames7 = names7[Math.floor(Math.random() * names7.length)]
$("#singer7").text(selnames7)
}
for (var i = 0; i < names8.length; i++) {

var selnames8 = names8[Math.floor(Math.random() * names8.length)]


$("#singer8").text(selnames8)

}
for (var i = 0; i < names9.length; i++) {
var selnames9 = names9[Math.floor(Math.random() * names9.length)]
$("#singer9").text(selnames9)
}
for (var i = 0; i < names8.length; i++) {

var selnames10 = names10[Math.floor(Math.random() * names10.length)]


$("#singer10").text(selnames10)

}

module.exports(names1,names2,names3,names4,names5,names6,names7, names8, names9, names10)